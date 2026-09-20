import type { RootState } from '@/lib/store/store';
import type { Action, ThunkAction } from '@reduxjs/toolkit';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type FetchAction = { query?: string; page: number; pageSize?: number };
export type PaginatedAction = (params: FetchAction) => ThunkAction<unknown, RootState, unknown, Action>;
export type PaginationConfig = { maxLength: number; fetchAction: PaginatedAction; query?: string; children?: ReactNode; className?: string };
export type ChartEntry = { name: string; value: number };
export type ChartMeasure = 'count' | 'duration' | 'percentage' | 'proficiency';
export type ChartConfig = {
    title?: string;
    description?: string;
    groupBy?: string | string[];
    customData?: ChartEntry[];
    measure?: ChartMeasure;
    unit?: 'items' | 'months' | 'percent';
    maxItems?: number;
};
export type DurationChartConfig = ChartConfig & { durationKeys?: { start?: string; end?: string } };
export type TimelineEntry = { id: string; name: string; detail?: string; start: string; end?: string; ongoing?: boolean };
export type TimelineConfig = { title: string; description?: string; data: TimelineEntry[] };
export type MatrixRow = { name: string; projects: number; experience: number; education: number; certificates: number };
export type MatrixConfig = { title: string; description?: string; rows: MatrixRow[] };
export type KpiEntry = { label: string; value: number; unit?: string };
export type ListItemConfig = { icon?: LucideIcon; leftKey?: string | string[]; between?: string; rightKey?: string | string[]; size?: 'lg' | 'md' | 'sm' | null; isTime?: boolean; isLink?: boolean; itemIcon?: string; label?: string };
export type EntryPresentationVariant = 'project' | 'experience' | 'education' | 'certificate' | 'skill' | 'language';
export type EntryPresentation = { variant: EntryPresentationVariant; singularLabel: string };

export interface WidgetCardProps {
    isLoading?: boolean;
    error?: string | null;
    header?: { title?: string; icon?: LucideIcon; description?: string };
    items: object[];
    emptyState?: { title: string; description: string };
    list?: ListItemConfig[];
    pie?: ChartConfig;
    bar?: DurationChartConfig;
    radar?: ChartConfig;
    timeline?: TimelineConfig;
    matrix?: MatrixConfig;
    kpis?: KpiEntry[];
    create?: { title?: string; subTitle?: string; form?: ReactNode; icon?: LucideIcon };
    update?: { title?: string; subTitle?: string; form?: ReactNode };
    del?: { title?: string; subTitle?: string; message?: string; onDelete: (id: string) => void | boolean | Promise<void | boolean> };
    details?: ListItemConfig[];
    onSort?: (ids: string[]) => void | Promise<void>;
    pagination?: PaginationConfig;
    onModalAction?: (id: string) => void | Promise<void>;
    entryPresentation?: EntryPresentation;
    className?: string;
}

export type ChartWidgetProps = { data: ChartEntry[]; colorMap?: Record<string, string>; unit?: ChartConfig['unit'] };
export type WidgetChartsProps = { items?: object[]; pie?: ChartConfig; bar?: DurationChartConfig; radar?: ChartConfig; timeline?: TimelineConfig; matrix?: MatrixConfig; kpis?: KpiEntry[] };
export type WidgetListProps = { items: object[]; list: ListItemConfig[]; onItemClick?: (item: object) => void; className?: string; sort?: { sortable: boolean; onSort?: (ids: string[]) => void | Promise<void> }; pagination?: PaginationConfig; entryPresentation?: EntryPresentation };
export type WidgetModalProps = { isLoading?: boolean; isOpen: boolean; onClose: () => void; item?: object; update?: WidgetCardProps['update']; del?: WidgetCardProps['del']; details?: ListItemConfig[]; entryPresentation?: EntryPresentation; className?: string; onAction?: (id: string) => void | Promise<void> };
export type SortableItemProps = { id: string; children: ReactNode; label?: string };
