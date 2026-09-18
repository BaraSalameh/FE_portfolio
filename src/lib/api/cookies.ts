import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

const LEGACY_REFRESH_COOKIE_PATH = '/api/Account';
export const LEGACY_REFRESH_COOKIE_DELETION =
    'RefreshToken=; Path=/api/Account; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; HttpOnly; Secure; SameSite=None';

export const getCookies = async () => {
    const cookieStore = await cookies();
    const all = cookieStore.getAll();

    const header = all
        .map(c => `${c.name}=${c.value}`)
        .join("; ");

    return header;
}

export const setCookies = async (response: Response) => {
    // forward cookies to the browser
    const setCookies = response.headers.getSetCookie?.() ?? [];

    const cookieStore = await cookies();

    for (const rawCookie of setCookies) {
        const parsed = parseCookie(rawCookie);
        const authPath = getAuthCookiePath(parsed.name);
        if (authPath) parsed.options.path = authPath;
        if (parsed.name === 'RefreshToken') {
            // Remove cookies issued by the previous, API-only path. Leaving both
            // paths alive can send two RefreshToken values to the API.
            cookieStore.set(parsed.name, '', {
                ...parsed.options,
                path: LEGACY_REFRESH_COOKIE_PATH,
                expires: new Date(0),
                maxAge: 0,
            });
        }
        cookieStore.set(parsed.name, parsed.value, parsed.options);
    }
}

const getAuthCookiePath = (name: string) => {
    if (name === 'AccessToken') return '/';
    // Server Components and Server Actions are requested at page URLs, not at
    // /api/Account. Keep this HttpOnly credential available to those server
    // entry points so they can renew an expired access token.
    if (name === 'RefreshToken') return '/';
    return undefined;
};

export const normalizeAuthCookiePath = (rawCookie: string) => {
    const name = rawCookie.slice(0, rawCookie.indexOf('=')).trim();
    const path = getAuthCookiePath(name);
    if (!path) return rawCookie;

    if (/;\s*path=/i.test(rawCookie)) {
        return rawCookie.replace(/;\s*path=[^;]*/i, `; Path=${path}`);
    }

    return `${rawCookie}; Path=${path}`;
};

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
        target.headers.append('set-cookie', normalizeAuthCookiePath(cookie));
    }
    return target;
};

export const clearAuthCookies = (response: NextResponse) => {
    const expired = 'Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; HttpOnly; Secure; SameSite=None';
    response.headers.append('set-cookie', `AccessToken=; Path=/; ${expired}`);
    response.headers.append('set-cookie', `RefreshToken=; Path=/; ${expired}`);
    response.headers.append('set-cookie', LEGACY_REFRESH_COOKIE_DELETION);
    return response;
};
