import { ExperienceFormData } from "./schema";

// slice
export interface ExperienceState {
    lstExperiences: ExperienceFormData[];
    loading: boolean;
    error: string | null;
}

// form
export interface ExperienceProps {
    id?: string;
    onClose?: () => void;
}