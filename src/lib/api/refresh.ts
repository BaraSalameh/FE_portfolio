import { browserApiResponse } from './browser-client';
import { loginPath } from './auth-navigation';

let refreshPromise: Promise<Response> | null = null;
let logoutPromise: Promise<void> | null = null;

export const endBrowserSession = () => {
    logoutPromise ??= (async () => {
        await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
        const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;
        const loginUrl = new URL(loginPath(returnTo), window.location.origin);
        loginUrl.searchParams.set('refreshFailed', '1');
        window.location.assign(loginUrl);
    })().catch(error => { logoutPromise = null; throw error; });
    return logoutPromise;
};

export const refreshTokenClient = (): Promise<Response> => {
    if (refreshPromise) return refreshPromise;

    refreshPromise = browserApiResponse({
        method: 'POST',
        url: '/Account/ValidateToken',
        data: {},
        retryOn401: false,
        sendCredentials: true,
    }).finally(() => {
        refreshPromise = null;
    });

    return refreshPromise;
};
