const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export const getApiBaseUrl = () => {
    // Browser traffic stays same-origin and is relayed by app/api/[...path].
    // This keeps HttpOnly cookies scoped to the frontend and avoids cross-origin
    // cookie behavior differing between local and production deployments.
    if (typeof window !== 'undefined') return '/api';

    const configuredUrl = process.env.API_URL;

    if (!configuredUrl) {
        throw new Error('API_URL is required for server-side portfolio-api requests.');
    }

    const baseUrl = trimTrailingSlash(configuredUrl);
    return baseUrl.endsWith('/api') ? baseUrl : `${baseUrl}/api`;
};
