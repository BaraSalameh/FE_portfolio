import { ProfileFormData } from "./profile/schema";

export interface ProfileState {
    user: ProfileFormData | null;
    loading: boolean;
    error: string[] | string | null;
}