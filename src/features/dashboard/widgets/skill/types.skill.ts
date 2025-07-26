import { SkillCategoryFormData, SkillFormData, UserSkillFormData } from "./schema";

// form
export interface SkillProps {
    id?: string;
    onClose?: () => void;
}

// slice
export interface UserSkillState {
    lstUserSkills: UserSkillFormData[];
    skill: SkillState;
    loading: boolean;
    error: string | null;
}

interface SkillState {
    lstSkills: SkillFormData[];
    skillsRowCount: number;
    loading: boolean;
    error: string | null;
}