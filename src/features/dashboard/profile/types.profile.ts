import { ProfileFormData } from "./schema";

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
    className?: string;
}
