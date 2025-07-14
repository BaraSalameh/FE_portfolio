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