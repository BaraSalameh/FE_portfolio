import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";

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
    response.headers.append('set-cookie', `RefreshToken=; Path=/api/Account; ${expired}`);
    response.headers.append('set-cookie', `RefreshToken=; Path=/api/v1/Account; ${expired}`);
    return response;
};
