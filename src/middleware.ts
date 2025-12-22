import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from 'next/server';
import { paths } from "./lib/pathHelper";
import { refreshTokenServer } from "./lib/api/refreshToken.server";
import { setCookies } from "./lib/api/cookieHelpers";

export default async function middleware(req: NextRequest) {
    const accessToken = req.cookies.get('AccessToken')?.value;
    const refreshToken = req.cookies.get('RefreshToken')?.value;

    if (!accessToken) {
        if (!refreshToken) return NextResponse.next()
        
        try {
            const response = await refreshTokenServer();
            const { role, username } = await response.json();
            
            await setCookies(response);
            return NextResponse.redirect(new URL(`/${role}/${username}/dashboard`.toLowerCase(), req.url), { status: 307});
        } catch {
            return NextResponse.next();
        }
    };

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(accessToken, secret);
        const { role, unique_name, IsConfirmed } = payload;

        if(!IsConfirmed) return NextResponse.redirect(
            new URL(paths.root.auth.email.path(), req.url)
        );

        return NextResponse.redirect(
            new URL(`/${role}/${unique_name}/dashboard`.toLowerCase(), req.url)
        );
    } catch {
        // token invalid or expired
        return NextResponse.next();
    }
}

export const config = {
    matcher: ['/auth/login'],
};
