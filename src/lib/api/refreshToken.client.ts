import { browserApiResponse } from './browser-client';

let refreshPromise: Promise<Response> | null = null;

export const refreshTokenClient = (): Promise<Response> => {
    if (refreshPromise) return refreshPromise;

    refreshPromise = browserApiResponse({
        method: 'POST',
        url: '/Account/ValidateToken',
        data: {},
        retryOn401: false,
        sendCredentials: true,
    }).catch((error: unknown) => {
        window.location.assign(new URL('/auth/login', window.location.origin));
        throw error;
    }).finally(() => {
        refreshPromise = null;
    });

    return refreshPromise;
};
