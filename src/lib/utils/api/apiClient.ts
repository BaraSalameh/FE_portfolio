import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { HTTPMethod } from './types.utils.api';

const api = axios.create({
    baseURL: process.env.NODE_ENV === 'development'
        ?   `${process.env.NEXT_PUBLIC_API_URL}/api`
        :   '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;

const refreshAccessToken = async () => {
    if (!isRefreshing) {
        isRefreshing = true;
        try {
            await api.post('/Account/ValidateToken', {}, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            }); 
        } finally {
            isRefreshing = false;
        }
    }
};

interface DynamicApiOptions extends AxiosRequestConfig {
    method: HTTPMethod;
    url: string;
    data?: any;
    sendCredentials?: boolean;
    retryOn401?: boolean;
}

export const dynamicApi = async <T = any>(
    options: DynamicApiOptions
): Promise<AxiosResponse<T>> => {
    const { sendCredentials = true, retryOn401 = true, ...axiosOptions } = options;

    try {
        return await api.request<T>({
            ...axiosOptions,
            withCredentials: sendCredentials
        });
    } catch (error: any) {
        // If unauthorized and not already retried, try refresh
        if (error.response?.status === 401 && retryOn401 && !options.headers?.['x-retry']) {
            try {
                await refreshAccessToken();
                return await api.request<T>({
                    ...axiosOptions,
                    headers: {
                        ...(axiosOptions.headers || {}),
                        'x-retry': 'true', // Prevent infinite loop
                    },
                    withCredentials: sendCredentials
                });
            } catch (refreshError) {
                // Optionally redirect to login if refresh fails
                window.location.href = '/';
            }
        }
        throw error;
    }
};
