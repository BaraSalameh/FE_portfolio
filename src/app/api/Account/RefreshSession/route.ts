import { NextRequest, NextResponse } from 'next/server';
import { requestServerSessionRefresh } from '@/lib/api/server-client';
import { clearAuthCookies, forwardSetCookieHeaders, getRefreshAttempt, markRefreshAttempt, wasJustRefreshed } from '@/lib/api/cookies';
import { paths } from '@/lib/pathHelper';
import { loginPath, safeAppPath } from '@/lib/api/auth-navigation';
import { ApiError } from '@/lib/api/types';

const safeReturnPath = (request: NextRequest) => {
    const requested = request.nextUrl.searchParams.get('returnTo');
    return safeAppPath(requested, { allowLogin: true })
        ?? paths.root.path();
};

export async function GET(request: NextRequest) {
    // The App Router may fetch a redirect destination more than once as RSC.
    // A non-RSC response makes it perform a document navigation. Only that
    // navigation may rotate credentials and commit Set-Cookie to the browser.
    if (request.headers.get('rsc') === '1') {
        return new NextResponse(null, {
            headers: { 'content-type': 'text/html', 'cache-control': 'no-store' },
        });
    }

    const returnTo = safeReturnPath(request);
    let refreshResponse: Response;
    const access = request.cookies.get('AccessToken')?.value;

    const failedLogin = () => {
        const nestedReturn = returnTo.startsWith('/auth/login?')
            ? safeAppPath(new URL(returnTo, request.url).searchParams.get('returnTo'))
            : safeAppPath(returnTo);
        const loginUrl = new URL(loginPath(nestedReturn), request.url);
        loginUrl.searchParams.set('refreshFailed', '1');
        const response = NextResponse.redirect(loginUrl);
        response.headers.set('cache-control', 'no-store');
        return response;
    };

    if (wasJustRefreshed(access, await getRefreshAttempt())) {
        return clearAuthCookies(failedLogin());
    }

    try {
        // Top-level GET navigations do not carry an Origin header. The refresh
        // call is an authenticated POST, so explicitly forward this route's
        // same-origin URL for the API's CSRF origin validation.
        refreshResponse = await requestServerSessionRefresh(request.nextUrl.origin);
    } catch (error) {
        const response = failedLogin();

        if (error instanceof ApiError && error.status === 401) {
            return clearAuthCookies(response);
        }
        return response;
    }

    const response = NextResponse.redirect(new URL(returnTo, request.url));
    response.headers.set('cache-control', 'no-store');
    markRefreshAttempt(refreshResponse, response, access);
    return forwardSetCookieHeaders(refreshResponse, response);
}

export function HEAD() {
    return new NextResponse(null, { headers: { 'cache-control': 'no-store' } });
}
