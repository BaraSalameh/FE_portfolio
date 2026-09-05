import { browserApi } from '@/lib/api/browser-client';
import type { ProfileImageKind } from './types.profile';

export const uploadProfileImage = async (file: Blob, imageKind: ProfileImageKind) => {
    const formData = new FormData();
    formData.append('file', file, `${imageKind}.jpg`);
    formData.append('imageKind', imageKind);

    const response = await browserApi<{ url: string }>({
        method: 'POST',
        url: '/Owner/UpdateProfileImage',
        data: formData,
    });

    return response.data.url;
};

export const removeProfileImage = async (imageKind: ProfileImageKind) => {
    await browserApi({
        method: 'DELETE',
        url: `/Owner/RemoveProfileImage?imageKind=${encodeURIComponent(imageKind)}`,
    });
};
