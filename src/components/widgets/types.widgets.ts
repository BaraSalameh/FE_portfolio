import { Pagination } from "@/components/types.components";
import { WidgetCardVariantProps, WidgetListVariantProps } from "@/styles/widget";
import { LucideIcon } from "lucide-react";

export type PieChartProps = {
    title?: string;
    groupBy?: string | string[];
    customData?: ChartEntry[];
} 

export type BarChartProps = {
    title?: string;
    groupBy?: string | string[];
    durationKeys?: {
        start?: string;
        end?: string;
    };
    customData?: ChartEntry[];
}

export type RadarChartProps = {
    title?: string;
    groupBy?: string | string[];
    customData?: ChartEntry[];
}

export interface WidgetCardProps extends WidgetCardVariantProps {
    isLoading?: boolean;
    header?: {
        title?: string;
        icon?: LucideIcon;
    };
    items: object[];
    list?: ListItemConfig[];
    pie?: PieChartProps;
    bar?: BarChartProps;
    radar?: RadarChartProps;
    create?: {
        title?: string;
        subTitle?: string;
        form?: React.ReactNode;
        icon?: LucideIcon;
    };
    update?: {
        title?: string;
        subTitle?: string;
        form?: React.ReactNode;
    };
    del?: {
        title?: string;
        subTitle?: string;
        message?: string;
        onDelete: (id: string) => void | Promise<void>;
    };
    details?: ListItemConfig[];
    onSort?: (lstIds: string[]) => void | Promise<void>;
    pagination?: Pagination;
    onModalAction?: (id: string) => void | Promise<void>;
    className?: string;
}

export interface WidgetChartsProps {
    items?: object[];
    pie?: PieChartProps;
    bar?: BarChartProps;
    radar?: RadarChartProps;
}

export interface ListItemConfig {
    icon?: LucideIcon;
    leftKey?: string | string[];
    between?: string;
    rightKey?: string | string[];
    size?: 'lg' | 'md' | 'sm' | null;
    isTime?: boolean;
    isLink?: boolean;
    itemIcon?: string;
}

export interface WidgetListProps extends WidgetListVariantProps {
    items: object[];
    list: ListItemConfig[];
    onItemClick?: (item: object) => void;
    className?: string;
    sort?: {
        sortable: boolean;
        onSort?: (lstIds: string[]) => void | Promise<void>;
    }
    pagination?: Pagination
}

export interface WidgetModalProps {
    isLoading?: boolean;
    isOpen: boolean;
    onClose: () => void;
    item?: object;
    update?: {
        title?: string;
        subTitle?: string;
        form?: React.ReactNode;
    };
    del?: {
        title?: string;
        subTitle?: string;
        message?: string;
        onDelete: (id: string) => void | Promise<void>;
    };
    details?: ListItemConfig[];
    className?: string;
    onAction?: (id: string) => void | Promise<void>;
}

export type ChartEntry = {
    name: string;
    value: number;
}

export type ChartWidgetProps = {
    data: ChartEntry[];
    colorMap?: Record<string, string>;
}

export interface SortableItemProps {
    id: string;
    children: React.ReactNode;
}
