import { ApiError } from '@/lib/definitions/api.definitions';

export const getApiErrorMessage = (data: unknown, fallback: string) => {
    if (typeof data === 'string' && data.trim()) return data;
    if (Array.isArray(data) && data.every(item => typeof item === 'string')) {
        return data.join(' ');
    }
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

export const toApiError = async (response: Response) => {
    const fallback = `Request failed with status ${response.status}`;
    let data: unknown;

    try {
        data = await response.clone().json();
    } catch {
        // Empty and non-JSON responses use the status-based fallback.
    }

    return new ApiError(getApiErrorMessage(data, fallback), response.status, data);
};

export const getApiErrorPayload = (error: unknown): string => {
    if (error instanceof ApiError) return error.message;
    if (error instanceof Error) return error.message;
    return 'Unexpected error occurred';
};
