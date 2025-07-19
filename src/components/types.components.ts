import { RootState } from "@/lib/store/store";
import { InfiniteScrollVariantProps } from "@/styles/infiniteScroll";
import { Action, ThunkAction } from "@reduxjs/toolkit";

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none' | 'full';
export type FetchAction = {
    query?: string;
    page: number;
    pageSize?: number;
}
export type PaginatiedAction = (params: FetchAction) => ThunkAction<any, RootState, unknown, Action>;

export interface FCProps {
    children: React.ReactNode;
    className?: string;
}

export interface Pagination {
    maxLength: number;
    fetchAction: PaginatiedAction;
    query?: string;
    children?: React.ReactNode; 
    className?: string;
    styles?: InfiniteScrollVariantProps
}