import { GetClientLinkResponse } from "./types.utils.api";

export const getClientLink = (): GetClientLinkResponse => {
    if (typeof window === 'undefined') return null;

    const { origin, pathname } = window.location;
    const parts = pathname.split('/');

    if (parts.length > 1) {
        parts[1] = 'client';
    }

    const modifiedPath = parts.join('/');
    return {
        fullPath: `${origin}${modifiedPath}`,
        shortPath: modifiedPath
    }
};