import { jwtDecode, JwtPayload } from 'jwt-decode';
import { NextRequest, NextResponse } from 'next/server';
import { paths } from "./lib/pathHelper";

interface AccessTokenClaims extends JwtPayload {
    role?: string;
    unique_name?: string;
    IsConfirmed?: string;
}

export default async function proxy(req: NextRequest) {
    const accessToken = req.cookies.get('AccessToken')?.value;
    if (!accessToken) return NextResponse.next();

    try {
        // This is deliberately an optimistic navigation hint only. The API
        // remains authoritative for token validation and authorization.
        const { role, unique_name, IsConfirmed, exp } = jwtDecode<AccessTokenClaims>(accessToken);
        if (!exp || exp * 1000 <= Date.now()) return NextResponse.next();

        if (IsConfirmed !== 'True') return NextResponse.redirect(
            new URL(paths.root.auth.email.path(), req.url)
        );

        if (!role || !unique_name) return NextResponse.next();

        return NextResponse.redirect(
            new URL(`/${role}/${unique_name}/dashboard`.toLowerCase(), req.url)
        );
    } catch {
        // A malformed token is ignored here and rejected by portfolio-api.
        return NextResponse.next();
    }
}

export const config = {
    matcher: ['/auth/login'],
};
