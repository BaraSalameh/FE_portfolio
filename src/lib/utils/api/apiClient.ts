import { browserApi } from '@/lib/api/browser-client';
import { getApiErrorPayload } from '@/lib/api/errors';
import { ApiError, DynamicFetchOptions } from '@/lib/definitions/api.definitions';
import { executeDashboardMutation } from '@/lib/server-actions/dashboard-mutations.actions';

interface DynamicApiOptions extends DynamicFetchOptions {
    withCredentials?: boolean;
}

type MutationApiOptions = DynamicApiOptions & {
    method: Exclude<DynamicFetchOptions['method'], 'GET'>;
};

export interface DynamicApiResponse<T> {
    data: T;
    status: number;
    headers: Headers;
}

export { getApiErrorPayload };

export const dashboardMutation = async (options: MutationApiOptions): Promise<void> => {
    const result = await executeDashboardMutation({
        method: options.method,
        url: options.url,
        data: options.data,
    });
    if (!result.success) throw new ApiError(result.error, 400);
};

/** Compatibility adapter for existing dashboard thunks. */
export const dynamicApi = async <T = unknown>(
    options: DynamicApiOptions,
): Promise<DynamicApiResponse<T>> => {
    const { withCredentials, ...fetchOptions } = options;

    if (options.method !== 'GET') throw new ApiError('Use dashboardMutation for mutations', 500);

    const response = await browserApi<T>({
        ...fetchOptions,
        sendCredentials: withCredentials ?? options.sendCredentials,
    });
    return response;
};
