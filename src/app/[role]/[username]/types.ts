import { Option } from "@/components/ui/form/types";

export interface EducationProps {
    id?: string;
    onClose?: () => void;
}

export interface ExperienceProps {
    id?: string;
    onClose?: () => void;
}

export interface ProjectTechnologyProps {
    id?: string;
    onClose?: () => void;
}

export interface UserLanguageProps {
    id?: string;
    onClose?: () => void;
}

type PreferenceValue = 'toggle' | Option[]
export interface UserPreferenceProps {
    id?: string;
    onClose?: () => void;
    preferenceKey: string;
    preferenceValues?: PreferenceValue;
}

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