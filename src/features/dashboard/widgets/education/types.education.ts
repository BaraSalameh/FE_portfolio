import { SkillFormData } from "../project/schema";
import { DegreeFormData, EducationFormData, FieldOfStudyFormData, InstitutionFormData } from "./schema";

// form
export interface EducationProps {
    id?: string;
    onClose?: () => void;
}

// slice
export interface EducationState {
    lstEducations: EducationResponse[];
    institution: InstitutionState;
    degree: DegreeState;
    fieldOfStudy: FieldOfStudyState;
    loading: boolean;
    error: string | null;
}

interface InstitutionState {
    lstInstitutions: InstitutionFormData[];
    institutionRowCount: number;
    loading: boolean;
    error: string | null;
}

interface DegreeState {
    lstDegrees: DegreeFormData[];
    degreeRowCount: number;
    loading: boolean;
    error: string | null;
}

interface FieldOfStudyState {
    lstFields: FieldOfStudyFormData[];
    fieldRowCount: number;
    loading: boolean;
    error: string | null;
}

// schema
export interface EducationResponse {
    id: string;
    institution: InstitutionFormData;
    degree: DegreeFormData;
    fieldOfStudy: FieldOfStudyFormData;
    startDate: string;
    endDate?: string;
    description?: string;
    lstProjects: Record<string, string>[];
    lstSkills: SkillFormData[];
}