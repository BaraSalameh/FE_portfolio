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

export type SkillMap = Record<string, SkillLink[]>;

type SkillLink = {
    id: string;
    prop?: any;  // make generic so it's not tied to only Education
    skill: SkillFormData;
};


// schema
export interface UserSkillResponse {
    skill: Record<string, string>;
    lstEducations?: US_EducationResponse[];
    lstExperiences?: Record<string, string>[];
    lstProjects?: Record<string, string>[];
    lstCertificates?: US_CertificateResponse[];
}

interface US_EducationResponse {
    id: string;
    institution: Record<string, string>;
}

interface US_CertificateResponse {
    id: string;
    certificate: Record<string, string>;
}