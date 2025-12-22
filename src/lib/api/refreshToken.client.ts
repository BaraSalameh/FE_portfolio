import { dynamicFetch } from './fetchClient';

export const refreshTokenClient = async () => {

    const refresh = await dynamicFetch({
        method: 'POST',
        url: '/Account/ValidateToken',
        data: {},
        retryOn401: false,
        sendCredentials: true,
    });

    return refresh;
};
