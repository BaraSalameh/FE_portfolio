import { DegreeFormData, EducationFormData, FieldOfStudyFormData, InstitutionFormData } from "./schema";

// form
export interface EducationProps {
    id?: string;
    onClose?: () => void;
}

// slice
export interface EducationState {
    lstEducations: EducationFormData[];
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