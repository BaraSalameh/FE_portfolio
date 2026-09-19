export const normalizeHeaders = (headers?: HeadersInit): Record<string, string> =>
    Object.fromEntries(new Headers(headers).entries());
