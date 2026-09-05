'use client';

import { DynamicFetchOptions, ApiError, RefreshHandler } from '@/lib/api/types';
import { toApiError } from './errors';

const refreshAccessToken: RefreshHandler = async () => {
    const { refreshTokenClient } = await import('./refresh');
    return refreshTokenClient();
};

export const browserApiResponse: (
    options: DynamicFetchOptions,
    refresh?: RefreshHandler,
) => Promise<Response> = async (
    options,
    refresh: RefreshHandler = refreshAccessToken,
) => {
    const {
        url,
        data,
        sendCredentials = true,
        retryOn401 = true,
        headers,
        ...requestInit
    } = options;

    let response: Response;
    try {
        const isFormData = data instanceof FormData;
        response = await fetch(`/api${url.startsWith('/') ? url : `/${url}`}`, {
            ...requestInit,
            method: options.method,
            credentials: sendCredentials ? 'include' : 'omit',
            headers: {
                ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
                ...headers,
            },
            body: data === undefined ? undefined : isFormData ? data : JSON.stringify(data),
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to reach portfolio-api';
        throw new ApiError(message, 0);
    }

    if (response.status === 401 && retryOn401) {
        try {
            await refresh();
            return browserApiResponse({
                ...options,
                retryOn401: false,
                headers: { ...headers, 'x-retry': 'true' },
            }, refresh);
        } catch {
            throw new ApiError('Unauthorized', response.status);
        }
    }

    if (!response.ok) throw await toApiError(response);
    return response;
};

export const browserApi = async <T = unknown>(options: DynamicFetchOptions) => {
    const response = await browserApiResponse(options);
    const data = response.status === 204 ? undefined : await response.json();

    return { data: data as T, status: response.status, headers: response.headers };
};
