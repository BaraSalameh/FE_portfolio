import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { createHash } from 'node:crypto';

const REFRESH_ATTEMPT_COOKIE = 'AuthRefreshAttempt';
const fingerprint = (token: string) => createHash('sha256').update(token).digest('hex');

// Carries the one-retry budget across the document redirect. It is only a
// loop guard, never authentication; a missing/deleted access token can refresh.
export const wasJustRefreshed = (accessToken?: string, marker?: string) =>
    Boolean(accessToken && marker === fingerprint(accessToken));

export const getRefreshAttempt = async () => (await cookies()).get(REFRESH_ATTEMPT_COOKIE)?.value;

export const markRefreshAttempt = (upstream: Response, target: NextResponse, previousAccess?: string) => {
    const access = upstream.headers.getSetCookie()
        .map(parseCookie).find(cookie => cookie.name === 'AccessToken' && cookie.value)?.value ?? previousAccess;
    if (access) target.cookies.set(REFRESH_ATTEMPT_COOKIE, fingerprint(access), {
        httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60,
    });
};

export const clearServerAuthCookies = async () => {
    const store = await cookies();
    for (const name of ['AccessToken', 'RefreshToken', REFRESH_ATTEMPT_COOKIE]) store.delete(name);
};

export const setCookies = async (response: Response) => {
    // forward cookies to the browser
    const setCookies = response.headers.getSetCookie?.() ?? [];

    const cookieStore = await cookies();

    for (const rawCookie of setCookies) {
        const parsed = parseCookie(rawCookie);
        cookieStore.set(parsed.name, parsed.value, parsed.options);
    }
}

// Utility to parse raw Set-Cookie header
function parseCookie(str: string) {
    const parts = str.split(";").map(v => v.trim());
    const [nameValue, ...rest] = parts;
    const separator = nameValue.indexOf('=');
    const name = separator === -1 ? nameValue : nameValue.slice(0, separator);
    const value = separator === -1 ? '' : nameValue.slice(separator + 1);

    const options: Partial<ResponseCookie> = {};

    for (const part of rest) {
        const [key, val] = part.split("=");
        const lower = key.toLowerCase();
        if (lower === "path") options.path = val || "/";
        else if (lower === "httponly") options.httpOnly = true;
        else if (lower === "secure") options.secure = true;
        else if (lower === "samesite") {
            const sameSite = val?.toLowerCase();
            if (sameSite === 'strict' || sameSite === 'lax' || sameSite === 'none') {
                options.sameSite = sameSite;
            }
        }
        else if (lower === "max-age") options.maxAge = Number(val);
        else if (lower === "domain") options.domain = val;
        else if (lower === "expires" && val) options.expires = new Date(val);
    }

    return {
        name,
        value,
        options
    };
}

export const forwardSetCookieHeaders = (source: Response, target: NextResponse) => {
    for (const cookie of source.headers.getSetCookie?.() ?? []) {
        target.headers.append('set-cookie', cookie);
    }
    return target;
};

export const clearAuthCookies = (response: NextResponse) => {
    const expired = 'Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; HttpOnly; Secure; SameSite=None';
    response.headers.append('set-cookie', `AccessToken=; Path=/; ${expired}`);
    for (const path of ['/', '/api', '/api/Account']) {
        response.headers.append('set-cookie', `RefreshToken=; Path=${path}; ${expired}`);
    }
    response.headers.append('set-cookie', `${REFRESH_ATTEMPT_COOKIE}=; Path=/; ${expired}`);
    return response;
};
