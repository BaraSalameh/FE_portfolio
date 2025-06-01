import { ProfileFormData } from "@/lib/schemas";

export interface ProfileProps {
    user: ProfileFormData,
    unreadContactMessageCount?: number;
    className?: string;
}