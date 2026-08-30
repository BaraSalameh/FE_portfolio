import { dynamicFetch } from '@/lib/api/fetchClient';
import { ApiError, DynamicFetchOptions } from '@/lib/definitions/api.definitions';

interface DynamicApiOptions extends DynamicFetchOptions {
    withCredentials?: boolean;
}

export interface DynamicApiResponse<T> {
    data: T;
    status: number;
    headers: Headers;
}

export const getApiErrorPayload = (error: unknown): unknown => {
    if (error instanceof ApiError) return error.message;
    if (error instanceof Error) return error.message;
    return 'Unexpected error occurred';
};

/** Compatibility adapter for dashboard thunks. New code should use dynamicFetch. */
export const dynamicApi = async <T = unknown>(
    options: DynamicApiOptions,
): Promise<DynamicApiResponse<T>> => {
    const { withCredentials, ...fetchOptions } = options;
    const response = await dynamicFetch({
        ...fetchOptions,
        sendCredentials: withCredentials ?? options.sendCredentials,
    });

    const data = response.status === 204 ? undefined : await response.json();

    return { data: data as T, status: response.status, headers: response.headers };
};
