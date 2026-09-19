import { NextRequest, NextResponse } from 'next/server';
import { requestServerSessionRefresh } from '@/lib/api/server-client';
import { LEGACY_REFRESH_COOKIE_DELETION, normalizeAuthCookiePath } from '@/lib/api/cookies';
import { paths } from '@/lib/pathHelper';

const safeReturnPath = (request: NextRequest) => {
    const requested = request.nextUrl.searchParams.get('returnTo');
    if (!requested || !requested.startsWith('/') || requested.startsWith('//')) {
        return paths.root.path();
    }

    const target = new URL(requested, request.nextUrl.origin);
    return target.origin === request.nextUrl.origin
        ? `${target.pathname}${target.search}${target.hash}`
        : paths.root.path();
};

export async function GET(request: NextRequest) {
    const returnTo = safeReturnPath(request);
    let refreshResponse: Response;

    try {
        // Top-level GET navigations do not carry an Origin header. The refresh
        // call is an authenticated POST, so explicitly forward this route's
        // same-origin URL for the API's CSRF origin validation.
        refreshResponse = await requestServerSessionRefresh(request.nextUrl.origin);
    } catch {
        return NextResponse.redirect(new URL(paths.root.auth.login.path(), request.url));
    }

    const response = NextResponse.redirect(new URL(returnTo, request.url));
    for (const cookie of refreshResponse.headers.getSetCookie()) {
        response.headers.append('set-cookie', normalizeAuthCookiePath(cookie));
    }
    response.headers.append('set-cookie', LEGACY_REFRESH_COOKIE_DELETION);
    return response;
}
