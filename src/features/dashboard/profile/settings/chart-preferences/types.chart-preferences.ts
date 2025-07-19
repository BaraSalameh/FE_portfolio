import { Option } from "@/features/types.features";
import { ChartTypeFormData, UserChartPreferenceFormData, WidgetFormData } from "./schema";

export type UserChartPreferenceKeys = {
    widget: string,
    chartType: string;
}

export type UserChartPreferenceValues = {
    groupBy: Option[],
    valueSource: Option[];
}

export interface UserChartPreferenceProps {
    id?: string;
    onClose?: () => void;
    preferenceKeys: UserChartPreferenceKeys;
    preferenceValues: UserChartPreferenceValues;
}

// User Chart Preference Slice
export interface UserChartPreferenceState {
    lstUserChartPreferences: UserChartPreferenceFormData[];
    widget: WidgetState;
    chartType: ChartTypeState;
    loading: boolean;
    error: string | null;
}

interface WidgetState {
    lstWidgets: WidgetFormData[];
    loading: boolean;
    error: string | null;
}

interface ChartTypeState {
    lstChartTypes: ChartTypeFormData[];
    loading: boolean;
    error: string | null;
}