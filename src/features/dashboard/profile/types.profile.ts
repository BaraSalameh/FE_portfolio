import { ProfileFormData } from "./schema";
import type { SocialLinkResponse } from '../types.dashboard';

export const profileImageKindByField = {
    profilePicture: 'ProfilePicture',
    coverPhoto: 'CoverPhoto',
} as const;

export type ProfileImageField = keyof typeof profileImageKindByField;
export type ProfileImageKind = (typeof profileImageKindByField)[ProfileImageField];

// slice
export interface ProfileState {
    user: ProfileFormData | null;
    loading: boolean;
    error: string[] | string | null;
}

//form
export interface ProfileProps {
    user: ProfileFormData,
    unreadContactMessageCount?: number;
    socialLinks?: SocialLinkResponse[];
    className?: string;
}
