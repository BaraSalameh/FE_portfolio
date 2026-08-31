'use client';

import { useAppSelector } from "@/lib/store/hooks";
import { useMemo } from "react";
import { ControlledForm } from '@/features/dashboard/forms';
import { mapUserLanguageToForm } from "@/lib/utils";
import { UserLanguageProps } from "../types.language";
import { userLanguageSchema } from "../schema";
import { languageListQuery } from "../thunks";
import { FormField } from '@/features/dashboard/forms/types.forms';
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
            resetItems={resetItems}
            indicator={{when: 'Update', while: 'Updating...'}}
        />
    );
}
