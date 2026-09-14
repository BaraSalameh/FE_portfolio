import { browserApi } from '@/lib/api/browser-client';
import type { DashboardResponse } from '../../types.dashboard';

export interface SocialLinkPayload {
    id?: string;
    platform: string;
    url: string;
    icon: string;
}

export const saveSocialLink = (payload: SocialLinkPayload) => browserApi({
    method: 'POST', url: '/Owner/AddEditSocialLink', data: payload,
});

export const deleteSocialLink = (id: string) => browserApi({
    method: 'DELETE', url: '/Owner/DeleteSocialLink', data: { id },
});

export const sortSocialLinks = (ids: string[]) => browserApi({
    method: 'POST', url: '/Owner/SortSocialLinks', data: { socialLinkIdsInOrder: ids },
});

export const loadOwnerDashboard = async () => (await browserApi<DashboardResponse>({
    method: 'GET', url: '/Owner/UserFullInfo',
})).data;
