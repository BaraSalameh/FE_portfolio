import {
    DegreeFormData,
    EducationFormData,
    ExperienceFormData,
    FieldOfStudyFormData,
    InstitutionFormData,
    LanguageFormData,
    LanguageProficiencyFormData,
    ProjectTechnologyFormData,
    TechnologyFormData,
    UserLanguageFormData
} from "@/lib/schemas";

//Education Slice
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

//Project Technology Slice
export interface ProjectTechnologyState {
    lstProjectTechnologies: ProjectTechnologyFormData[],
    technology: TechnologyState;
    loading: boolean;
    error: string | null;
}

interface TechnologyState {
    lstTechnologies: TechnologyFormData[];
    technologiesRowCount: number;
    loading: boolean;
    error: string | null;
}

// Experience Slice
export interface ExperienceState {
    lstExperiences: ExperienceFormData[];
    loading: boolean;
    error: string | null;
}

// User Language Slice
export interface UserLanguageState {
    lstUserLanguages: UserLanguageFormData[];
    language: LanguageState;
    languageProficiency: LanguageProficiencyState;
    loading: boolean;
    error: string | null;
}

interface LanguageState {
    lstLanguages: LanguageFormData[];
    languagesRowCount: number;
    loading: boolean;
    error: string | null;
}

interface LanguageProficiencyState {
    lstLanguageProficiencies: LanguageProficiencyFormData[];
    loading: boolean;
    error: string | null;
}