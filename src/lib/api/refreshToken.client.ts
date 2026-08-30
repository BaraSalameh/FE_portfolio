import { dynamicFetch } from './fetchClient';

let refreshPromise: Promise<Response> | null = null;

export const refreshTokenClient = () => {
    if (refreshPromise) return refreshPromise;

    refreshPromise = dynamicFetch({
        method: 'POST',
        url: '/Account/ValidateToken',
        data: {},
        retryOn401: false,
        sendCredentials: true,
    }).catch((error) => {
        window.location.assign(new URL('/auth/login', window.location.origin));
        throw error;
    }).finally(() => {
        refreshPromise = null;
    });

    return refreshPromise;
};
