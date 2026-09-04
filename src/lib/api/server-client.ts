import 'server-only';

import { cookies } from 'next/headers';
import { ApiError, DynamicFetchOptions } from '@/lib/api/types';
import { getApiBaseUrl } from './config';
import { toApiError } from './errors';

const serializeCookies = async () => {
    const cookieStore = await cookies();
    return cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join('; ');
};

export const requireAuthenticatedRequest = async () => {
    const cookieStore = await cookies();
    if (!cookieStore.has('AccessToken')) {
        throw new ApiError('Unauthorized', 401);
    }
};

export const serverApiResponse = async (options: DynamicFetchOptions): Promise<Response> => {
    const { url, data, headers, sendCredentials = true, ...requestInit } = options;
    delete requestInit.retryOn401;
    const cookie = sendCredentials ? await serializeCookies() : '';

    let response: Response;
    try {
        response = await fetch(`${getApiBaseUrl()}${url.startsWith('/') ? url : `/${url}`}`, {
            ...requestInit,
            method: options.method,
            cache: options.cache ?? 'no-store',
            headers: {
                'Content-Type': 'application/json',
                ...(cookie ? { cookie } : {}),
                ...headers,
            },
            body: data === undefined ? undefined : JSON.stringify(data),
            signal: options.signal ?? AbortSignal.timeout(30_000),
        });
    } catch (error) {
        console.error('[portfolio-api] request failed', {
            url,
            error: error instanceof Error ? error.message : String(error),
        });
        throw new ApiError('The service is temporarily unavailable. Please try again.', 0);
    }

    if (!response.ok) throw await toApiError(response);
    return response;
};

export const serverApi = async <T = unknown>(options: DynamicFetchOptions) => {
    const response = await serverApiResponse(options);
    const data = response.status === 204 ? undefined : await response.json();

    return { data: data as T, status: response.status, headers: response.headers };
};
