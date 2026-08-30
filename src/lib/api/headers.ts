export const RETRY_HEADER = 'x-retry' as const;

export const normalizeHeaders = (
    headers?: HeadersInit
): Record<string, string> => {
    if (!headers) return {};

    if (headers instanceof Headers) {
        return Object.fromEntries(headers.entries());
    }

    if (Array.isArray(headers)) {
        return Object.fromEntries(headers);
    }

    return headers;
};
