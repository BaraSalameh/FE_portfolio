import { EducationFormData } from "@/lib/schemas";

//Education Slice
interface InstitutionState {
    lstInstitutions: Record<string, any>[];
    institutionRowCount: number;
    loading: boolean;
    error: string | null;
}

interface DegreeState {
    lstDegrees: Record<string, any>[];
    degreeRowCount: number;
    loading: boolean;
    error: string | null;
}

interface FieldOfStudyState {
    lstFields: Record<string, any>[];
    fieldRowCount: number;
    loading: boolean;
    error: string | null;
}
export interface EducationState {
    lstEducations: EducationFormData[];
    loading: boolean;
    error: string | null;
    institution: InstitutionState;
    degree: DegreeState;
    fieldOfStudy: FieldOfStudyState;
}