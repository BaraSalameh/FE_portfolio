import { SkillFormData } from "../project/schema";

// form
export interface ExperienceProps {
    id?: string;
    onClose?: () => void;
}

// slice
export interface ExperienceState {
    lstExperiences: ExperienceResponse[];
    loading: boolean;
    error: string | null;
}

//schema
export interface ExperienceResponse {
    id: string;
    jobTitle: string;
    companyName: string;
    startDate: string;
    endDate?: string;
    location?: string;
    description?: string;
    lstSkills: SkillFormData[];
}