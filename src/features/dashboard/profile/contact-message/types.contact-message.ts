import { ContactMessageFormData } from "./schema";

// form
export interface ContactMessageProps {
    id?: string;
    onClose?: () => void;
    recipientEmail?: string;
    recipientName?: string;
}

// slice
export interface ContactMessageState {
    lstMessages: ContactMessageFormData[];
    unreadContactMessageCount: number;
    rowCount: number;
    loading: boolean;
    error: string | null;
}
