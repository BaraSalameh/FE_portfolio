import { RootState } from "@/lib/store/store";
import { ListVariantProps, ParagraphVariantProps } from "@/styles";
import { Action, ThunkAction } from "@reduxjs/toolkit";
import { LucideIcon } from "lucide-react";
import { InfiniteScrollVariantProps } from "@/styles/infiniteScroll";
import { FetchAction } from "../types.components";

export interface ListProps extends ListVariantProps {
    children: React.ReactNode;
    className?: string;
}

export interface ImageSliderProps {
    imageList: string[]
}

export interface ThemeToggleProps {
    title?: string;
    themeNameIncluded?: boolean;
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