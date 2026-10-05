import { ContactMessageFormData } from "./schema";

// form
export interface ContactMessageProps {
    onClose?: () => void;
}

// slice
export interface ContactMessageState {
    lstMessages: ContactMessageFormData[];
    unreadContactMessageCount: number;
    rowCount: number;
    loading: boolean;
    error: string | null;
}
