import { getCookies } from './cookieHelpers';
import { dynamicFetch } from './fetchClient';

export const refreshTokenServer = async () => {

    const refresh = await dynamicFetch({
        method: 'POST',
        url: '/Account/ValidateToken',
        data: {},
        headers: {
            Cookie: await getCookies()
        }
    });

    return refresh;
};
