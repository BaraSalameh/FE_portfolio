import { ProfileFormData } from "./schema";

//form
export interface ProfileProps {
    user: ProfileFormData,
    unreadContactMessageCount?: number;
    className?: string;
}