import { ProfileFormData } from "./schema";

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