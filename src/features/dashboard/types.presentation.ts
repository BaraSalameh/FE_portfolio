import type { RootState } from '@/lib/store/store';
import type { Action, ThunkAction } from '@reduxjs/toolkit';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type FetchAction = { query?: string; page: number; pageSize?: number };
export type PaginatedAction = (params: FetchAction) => ThunkAction<unknown, RootState, unknown, Action>;
export type PaginationConfig = { maxLength: number; fetchAction: PaginatedAction; query?: string; children?: ReactNode; className?: string };
export type ChartEntry = { name: string; value: number };
export type ChartConfig = { title?: string; groupBy?: string | string[]; customData?: ChartEntry[] };
export type DurationChartConfig = ChartConfig & { durationKeys?: { start?: string; end?: string } };
export type ListItemConfig = { icon?: LucideIcon; leftKey?: string | string[]; between?: string; rightKey?: string | string[]; size?: 'lg' | 'md' | 'sm' | null; isTime?: boolean; isLink?: boolean; itemIcon?: string };

export interface WidgetCardProps {
    isLoading?: boolean;
    header?: { title?: string; icon?: LucideIcon };
    items: object[];
    list?: ListItemConfig[];
    pie?: ChartConfig;
    bar?: DurationChartConfig;
    radar?: ChartConfig;
    create?: { title?: string; subTitle?: string; form?: ReactNode; icon?: LucideIcon };
    update?: { title?: string; subTitle?: string; form?: ReactNode };
    del?: { title?: string; subTitle?: string; message?: string; onDelete: (id: string) => void | Promise<void> };
    details?: ListItemConfig[];
    onSort?: (ids: string[]) => void | Promise<void>;
    pagination?: PaginationConfig;
    onModalAction?: (id: string) => void | Promise<void>;
    className?: string;
}

export type ChartWidgetProps = { data: ChartEntry[]; colorMap?: Record<string, string> };
export type WidgetChartsProps = { items?: object[]; pie?: ChartConfig; bar?: DurationChartConfig; radar?: ChartConfig };
export type WidgetListProps = { items: object[]; list: ListItemConfig[]; onItemClick?: (item: object) => void; className?: string; sort?: { sortable: boolean; onSort?: (ids: string[]) => void | Promise<void> }; pagination?: PaginationConfig };
export type WidgetModalProps = { isLoading?: boolean; isOpen: boolean; onClose: () => void; item?: object; update?: WidgetCardProps['update']; del?: WidgetCardProps['del']; details?: ListItemConfig[]; className?: string; onAction?: (id: string) => void | Promise<void> };
export type SortableItemProps = { id: string; children: ReactNode };
