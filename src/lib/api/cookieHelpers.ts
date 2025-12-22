import { cookies } from "next/headers";

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
    const [name, value] = nameValue.split("=");

    const options: Record<string, any> = {};

    for (const part of rest) {
        const [key, val] = part.split("=");
        const lower = key.toLowerCase();
        if (lower === "path") options.path = val || "/";
        else if (lower === "httponly") options.httpOnly = true;
        else if (lower === "secure") options.secure = true;
        else if (lower === "samesite") options.sameSite = val;
        else if (lower === "max-age") options.maxAge = Number(val);
        else if (lower === "domain") options.domain = val;
    }

    return {
        name,
        value,
        options
    };
}