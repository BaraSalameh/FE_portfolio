import { LkpSkillCategoryFormData, LkpSkillFormData, SkillFormData } from "./schema";

// form
export interface SkillProps {
    id?: string;
    onClose?: () => void;
}

// slice
export interface SkillState {
    lstSkills: SkillFormData[];
    lkpSkill: LkpSkillState;
    lkpSkillCategory: LkpSkillCategoryState;
    loading: boolean;
    error: string | null;
}

interface LkpSkillState {
    lstSkills: LkpSkillFormData[];
    skillsRowCount: number;
    loading: boolean;
    error: string | null;
}

interface LkpSkillCategoryState {
    lstSkillCategories: LkpSkillCategoryFormData[];
    skillCategoriesRowCount: number;
    loading: boolean;
    error: string | null;
}