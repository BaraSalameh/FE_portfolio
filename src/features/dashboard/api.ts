import 'server-only';

import { serverApi } from '@/lib/api/server-client';
import { DashboardResponse } from './types.dashboard';

export const getDashboard = async (role: string, username: string) => {
    const isOwner = role.toLowerCase() === 'owner';
    const request = isOwner
        ? { url: '/Owner/UserFullInfo', sendCredentials: true }
        : {
            url: `/Client/UserByUsername?Username=${encodeURIComponent(username)}`,
            sendCredentials: false,
        };

    const response = await serverApi<DashboardResponse>({
        method: 'GET',
        ...request,
    });

    if (response.status === 204 || !response.data) return null;
    return response.data;
};
