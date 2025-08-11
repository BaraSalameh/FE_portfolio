import { SkillFormData } from "../skill/schema";

// form
export interface ProjectProps {
    id?: string;
    onClose?: () => void;
}

// slice
export interface ProjectState {
    lstProjects: ProjectResponse[],
    loading: boolean;
    error: string | null;
}

// schema
export interface ProjectResponse {
    id: string;
    title: string;
    description?: string;
    liveLink?: string;
    sourceCode?: string;
    imageUrl?: string;
    isFeatured?: boolean;
    education: Record<string, string>;
    experience: Record<string, string>;
    lstSkills: SkillFormData[];
}