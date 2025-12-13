import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from 'next/server';
import { paths } from "./lib/pathHelper";

export default async function middleware(req: NextRequest) {
    const accessToken = req.cookies.get('AccessToken')?.value;
    const refreshToken = req.cookies.get('RefreshToken')?.value;

    if (!accessToken) {
        if (!refreshToken) return NextResponse.next()
        
        return NextResponse.redirect(
            new URL(paths.root.auth.login.validateToken.path(), req.url)
        )
    };

    try {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload } = await jwtVerify(accessToken, secret);
        console.log(payload);
        const { role, unique_name, IsConfirmed } = payload;

        if(!IsConfirmed) return NextResponse.redirect(
            new URL(paths.root.auth.register.confirmEmail(unique_name as string).path(), req.url)
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
