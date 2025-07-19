import { LucideIcon } from "lucide-react";
import { InputHTMLAttributes } from "react";

type ModalAs = 'create' | 'update' | 'delete' | 'none';

export interface CUDProps extends InputHTMLAttributes<HTMLInputElement> {
    isLoading?: boolean;
    idToDelete?: string;
    onAction?: (id: string) => any;
    onClose?: () => void;
    as?: ModalAs;
    title?: string;
    subTitle?: string;
    children?: React.ReactNode;
    icon?: LucideIcon;
    className?: string;
}