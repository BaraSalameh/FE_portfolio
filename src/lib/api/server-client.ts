import 'server-only';

import { cookies, headers as requestHeaders } from 'next/headers';
import { ApiError, DynamicFetchOptions } from '@/lib/api/types';
import { getApiBaseUrl } from './config';
import { setCookies } from './cookies';
import { toApiError } from './errors';

const serializeCookies = async () => {
    const cookieStore = await cookies();
    return cookieStore.getAll().map(({ name, value }) => `${name}=${value}`).join('; ');
};

export const serverApiResponse = async (options: DynamicFetchOptions): Promise<Response> => {
    const { url, data, headers, sendCredentials = true, ...requestInit } = options;
    delete requestInit.retryOn401;
    const cookie = sendCredentials ? await serializeCookies() : '';
    const isMutation = options.method !== 'GET';
    const origin = isMutation && sendCredentials
        ? (await requestHeaders()).get('origin')
        : null;

    let response: Response;
    try {
        response = await fetch(`${getApiBaseUrl()}${url.startsWith('/') ? url : `/${url}`}`, {
            ...requestInit,
            method: options.method,
            cache: options.cache ?? 'no-store',
            headers: {
                'Content-Type': 'application/json',
                ...(cookie ? { cookie } : {}),
                ...(origin ? { origin } : {}),
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

export const refreshServerSession = async () => {
    const response = await serverApiResponse({
        method: 'POST',
        url: '/Account/ValidateToken',
        data: {},
        sendCredentials: true,
        retryOn401: false,
    });
    await setCookies(response);
    return response;
};

export const serverApi = async <T = unknown>(options: DynamicFetchOptions) => {
    const response = await serverApiResponse(options);
    const data = response.status === 204 ? undefined : await response.json();

    return { data: data as T, status: response.status, headers: response.headers };
};

/** Use only from Server Functions/Route Handlers, where rotating cookies is legal. */
export const serverApiWithRefresh = async <T = unknown>(options: DynamicFetchOptions) => {
    try {
        return await serverApi<T>(options);
    } catch (error) {
        if (!(error instanceof ApiError) || error.status !== 401) throw error;
        await refreshServerSession();
        return serverApi<T>({ ...options, retryOn401: false });
    }
};
