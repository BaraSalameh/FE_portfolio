type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface DynamicFetchOptions extends RequestInit {
    method: HTTPMethod;
    url: string;
    data?: any;
    sendCredentials?: boolean;
    retryOn401?: boolean;
}

export type RefreshHandler = () => Promise<Response>;

export class ApiError extends Error {
    constructor(message: string, public readonly status: number) {
        super(message);
        this.name = "ApiError";
    }
}
