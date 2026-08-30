type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface DynamicFetchOptions extends RequestInit {
    method: HTTPMethod;
    url: string;
    data?: unknown;
    sendCredentials?: boolean;
    retryOn401?: boolean;
}

export type RefreshHandler = () => Promise<Response>;

export interface PaginatedResponse<T> {
    items: T[];
    rowCount: number;
}

export class ApiError extends Error {
    public readonly response: { status: number; data: unknown };

    constructor(
        message: string,
        public readonly status: number,
        public readonly data?: unknown,
    ) {
        super(message);
        this.name = "ApiError";
        this.response = { status, data };
    }
}
