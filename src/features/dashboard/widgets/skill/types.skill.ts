import { SkillFormData } from "./schema";

// form
export interface SkillProps {
    id?: string;
    onClose?: () => void;
}

// slice
export interface UserSkillState {
    lstUserSkills: UserSkillResponse[];
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

// schema
export interface UserSkillResponse {
    skill: Record<string, string>;
    education?: US_EducationResponse;
    experience?: Record<string, string>;
    project?: Record<string, string>;
    certificate?: US_CertificateResponse;
}

interface US_EducationResponse {
    id: string;
    institution: Record<string, string>;
}

interface US_CertificateResponse {
    id: string;
    certificate: Record<string, string>;
}