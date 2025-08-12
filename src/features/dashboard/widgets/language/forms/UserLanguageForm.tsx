'use client';

import { useAppSelector } from "@/lib/store/hooks";
import { useMemo } from "react";
import { ControlledForm } from "@/components/forms";
import { mapUserLanguageToForm } from "@/lib/utils";
import { UserLanguageProps } from "../types.language";
import { userLanguageSchema } from "../schema";
import { languageListQuery } from "../apis";
import { FormField } from "@/components/forms/types.forms";
import { useHandleSubmit, useLoadLanguage, useLoadLanguageProficiency } from "../hooks";

export const UserLanguageForm = ({onClose} : UserLanguageProps) => {

    const { loading, error, lstUserLanguages, language } = useAppSelector((state) => state.userLanguage);
    const { loading: languageLoading } = language;
    
    const languageOptions = useLoadLanguage();
    const languageProficiencyOptions = useLoadLanguageProficiency();
    const onSubmit = useHandleSubmit({onClose});
    const resetItems = useMemo(() => mapUserLanguageToForm(lstUserLanguages), [lstUserLanguages]);

    const fieldConfigs: FormField[] = useMemo(() => [
        {as: 'Dropdown' , label: 'Language', name: 'lkP_LanguageID', options: languageOptions, fetchAction: languageListQuery, isLoading: languageLoading},
        {as: 'Dropdown', label: 'Proficiency', name: 'lkP_LanguageProficiencyID', options: languageProficiencyOptions}
    ], [ languageOptions, languageProficiencyOptions, languageLoading ]);

    return (
        <ControlledForm
            schema={userLanguageSchema}
            onSubmit={onSubmit}
            items={[{as: 'FieldArray', name: 'lstLanguages', fields: fieldConfigs}]}
            error={error}
            loading={loading}
            resetItems={resetItems as any}
            indicator={{when: 'Update', while: 'Updating...'}}
        />
    );
}