import { ApiError, DynamicFetchOptions, RefreshHandler } from "../definitions/api.definitions";
import { refreshTokenClient } from "./refreshToken.client";

const BASE_URL =
    process.env.NODE_ENV === 'development'
        ? `${process.env.NEXT_PUBLIC_API_URL}/api`
        : '/api';


export const dynamicFetch = async (
    options: DynamicFetchOptions,
    refresh?: RefreshHandler
): Promise<Response> => {
    const {
        url,
        data,
        sendCredentials = true,
        retryOn401 = true,
        headers,
        ...rest
    } = options;

    refresh = refresh || refreshTokenClient;

    const response = await fetch(`${BASE_URL}${url}`, {
        ...rest,
        method: options.method,
        credentials: sendCredentials ? 'include' : 'omit',
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: data ? JSON.stringify(data) : undefined,
    });

    if (response.status === 401 && retryOn401) {
        try {
            await refresh()
            
            return await dynamicFetch({
                ...options,
                headers: {
                    ...headers,
                    'x-retry': 'true',
                },
            });
        } catch {
            throw new ApiError('Unauthorized', response.status);
        }
    }

    if (!response.ok) {
        let message = `Unexpected error ${response.status}`;
        try {
            const json = await response.json();
            message = json ?? message;
        } finally {
            throw new ApiError(message, response.status);
        }
    }
    
    return response;
};
