import { ApiError, DynamicFetchOptions, RefreshHandler } from "../definitions/api.definitions";
import { getApiBaseUrl } from "./config";
import { refreshTokenClient } from "./refreshToken.client";

const getErrorMessage = (data: unknown, fallback: string) => {
    if (typeof data === 'string' && data.trim()) return data;
    if (!data || typeof data !== 'object') return fallback;

    const problem = data as Record<string, unknown>;
    if (typeof problem.message === 'string' && problem.message.trim()) return problem.message;
    if (typeof problem.title === 'string' && problem.title.trim()) return problem.title;

    const list = problem.lstError;
    if (Array.isArray(list) && list.every(item => typeof item === 'string')) {
        return list.join(' ');
    }

    const errors = problem.errors;
    if (errors && typeof errors === 'object') {
        const messages = Object.values(errors as Record<string, unknown>)
            .flatMap(value => Array.isArray(value) ? value : [value])
            .filter((value): value is string => typeof value === 'string');
        if (messages.length) return messages.join(' ');
    }

    return fallback;
};

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

    const refreshHandler = refresh ?? (typeof window !== 'undefined' ? refreshTokenClient : undefined);

    let response: Response;
    try {
        response = await fetch(`${getApiBaseUrl()}${url.startsWith('/') ? url : `/${url}`}`, {
            ...rest,
            method: options.method,
            credentials: sendCredentials ? 'include' : 'omit',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: data === undefined ? undefined : JSON.stringify(data),
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unable to reach portfolio-api';
        throw new ApiError(message, 0);
    }

    if (response.status === 401 && retryOn401 && refreshHandler) {
        try {
            await refreshHandler();
            
            return dynamicFetch({
                ...options,
                retryOn401: false,
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
        let message = `Request failed with status ${response.status}`;
        let errorData: unknown;
        try {
            errorData = await response.json();
            message = getErrorMessage(errorData, message);
        } catch {
            // Retain the status-based message for empty or non-JSON bodies.
        }
        throw new ApiError(message, response.status, errorData);
    }
    
    return response;
};
