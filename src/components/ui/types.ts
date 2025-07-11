import { RootState } from "@/lib/store/store";
import { ListVariantProps, BlurBackgroundVariantProps, ParagraphVariantProps } from "@/styles";
import { Action, ThunkAction } from "@reduxjs/toolkit";
import { LucideIcon } from "lucide-react";
import { InputHTMLAttributes } from "react";
import { InfiniteScrollVariantProps } from "@/styles/infiniteScroll";
import { FetchAction } from "../types";
import { ContentContainerVariantProps } from "@/styles/contentContainer";

export interface BlurBackgroundProps extends BlurBackgroundVariantProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

type As = 'create' | 'update' | 'delete' | 'none';

export interface CUDProps extends InputHTMLAttributes<HTMLInputElement> {
    isLoading?: boolean;
    idToDelete?: string;
    onAction?: (id: string) => any;
    onClose?: () => void;
    as?: As;
    title?: string;
    subTitle?: string;
    children?: React.ReactNode;
    icon?: LucideIcon;
    className?: string;
}

export interface ListProps extends ListVariantProps {
    children: React.ReactNode;
    className?: string;
}

export interface ContentContainerProps extends ContentContainerVariantProps {
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export interface ParagraphProps extends ParagraphVariantProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export interface ResponsiveIconProps {
    icon?: LucideIcon;
    className?: string;
    onClick?: () => void;
}

export interface ControlledInfiniteScrollProps {
    items: Record<string, any>[];
    maxLength: number;
    fetchAction: (params: FetchAction) => ThunkAction<any, RootState, unknown, Action>;
    query?: string;
    children: React.ReactNode;
    className?: string;
    styles?: InfiniteScrollVariantProps;
}