import { Option } from "@/features/types.features";
import { UserWidgetPreferenceFormData, WidgetPreferenceFormData } from "./schema";

// User Widget Preference Slice
export interface UserPreferenceState {
    lstUserPreferences: UserWidgetPreferenceFormData[];
    preference: PreferenceState;
    loading: boolean;
    error: string | null;
}

interface PreferenceState {
    lstPreferences: WidgetPreferenceFormData[];
    loading: boolean;
    error: string | null;
}

// form
type PreferenceValue = 'toggle' | Option[]
export interface UserPreferenceProps {
    id?: string;
    onClose?: () => void;
    preferenceKey: string;
    preferenceValues?: PreferenceValue;
}