import { UserLanguageFormData } from "@/features/dashboard/widgets/language/schema";
import { UserLanguageResponse } from "@/features/dashboard/widgets/language/types.language";

export const mapUserLanguageToForm = (userLanguageFromDb: UserLanguageResponse[]): UserLanguageFormData => {
    const userLanguageDto = {
        lstLanguages: userLanguageFromDb.map((ul) => ({
            lkP_LanguageID: ul.language.id,
            lkP_LanguageProficiencyID: ul.languageProficiency.id
        }))
    };
    return userLanguageDto;
}
