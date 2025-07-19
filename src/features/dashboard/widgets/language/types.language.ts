import { LanguageFormData, LanguageProficiencyFormData, UserLanguageFormData } from "./schema";

// form
export interface UserLanguageProps {
    id?: string;
    onClose?: () => void;
}

// slice
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