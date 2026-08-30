import { LanguageFormData, LanguageProficiencyFormData } from "./schema";

// form
export interface UserLanguageProps {
    id?: string;
    onClose?: () => void;
}

// slice
export interface UserLanguageState {
    lstUserLanguages: UserLanguageResponse[];
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

export interface UserLanguageResponse {
    language: LanguageFormData;
    languageProficiency: LanguageProficiencyFormData;
}
