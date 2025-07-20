import { UserLanguageFormData } from "@/features/dashboard/widgets/language/schema";

export const mapUserLanguageToForm = (userLanguageFromDb: any): UserLanguageFormData => {
    const userLanguageDto = {
        lstLanguages: userLanguageFromDb.map((ul: Record<string, Record<string, string>>) => ({
            lkP_LanguageID: ul.language.id,
            lkP_LanguageProficiencyID: ul.languageProficiency.id
        }))
    };
    return userLanguageDto;
}