import { jwtDecode, JwtPayload } from 'jwt-decode';
import { NextRequest, NextResponse } from 'next/server';
import { safeAppPath } from '@/lib/api/auth-navigation';

interface AccessTokenClaims extends JwtPayload {
    role?: string;
    unique_name?: string;
    IsConfirmed?: string;
}

export default async function proxy(req: NextRequest) {
    // Navigation hints must not intercept login submissions or retry failures.
    if (req.method !== 'GET' || req.nextUrl.searchParams.get('refreshFailed') === '1') {
        return NextResponse.next();
    }
    const accessToken = req.cookies.get('AccessToken')?.value;
    const refreshToken = req.cookies.get('RefreshToken')?.value;
    const returnTo = safeAppPath(req.nextUrl.searchParams.get('returnTo'));

    const refreshSession = () => {
        const loginReturn = `${req.nextUrl.pathname}${req.nextUrl.search}`;
        const target = new URL('/api/Account/RefreshSession', req.url);
        target.searchParams.set('returnTo', loginReturn);
        return NextResponse.redirect(target);
    };

    if (!accessToken) {
        return refreshToken ? refreshSession() : NextResponse.next();
    }

    try {
        // This is deliberately an optimistic navigation hint only. The API
        // remains authoritative for token validation and authorization.
        const { role, unique_name, IsConfirmed, exp } = jwtDecode<AccessTokenClaims>(accessToken);
        if (typeof exp !== 'number' || !Number.isFinite(exp) || exp * 1000 <= Date.now()) {
            return refreshToken ? refreshSession() : NextResponse.next();
        }

        // Unconfirmed users must still be able to reach sign-in to retry
        // credentials or request another confirmation email.
        if (IsConfirmed !== 'True') return NextResponse.next();

        if (!role || !unique_name) return refreshToken ? refreshSession() : NextResponse.next();

        if (returnTo) return NextResponse.redirect(new URL(returnTo, req.url));

        return NextResponse.redirect(
            new URL(`/${encodeURIComponent(role.toLowerCase())}/${encodeURIComponent(unique_name)}/dashboard`, req.url)
        );
    } catch {
        return refreshToken ? refreshSession() : NextResponse.next();
    }
}

export const config = {
    matcher: ['/auth/login'],
};
