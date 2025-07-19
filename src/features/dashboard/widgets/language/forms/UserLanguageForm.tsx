'use client';

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { useEffect, useMemo, useState } from "react";
import { ControlledForm } from "@/components/forms";
import { mapUserLanguageToForm, mergeOptions, OptionsCreator } from "@/lib/utils/appFunctions";
import { Option } from "@/features/types.features";
import { UserLanguageProps } from "../types.language";
import { UserLanguageFormData, userLanguageSchema } from "../schema";
import { editDeleteUserLanguage, languageListQuery, languageProficiencyListQuery, userLanguageListQuery } from "../apis";

export const UserLanguageForm = ({id, onClose} : UserLanguageProps) => {

    const dispatch = useAppDispatch();
    const { loading, error, lstUserLanguages, language, languageProficiency } = useAppSelector((state) => state.userLanguage);
    const { loading: languageLoading, lstLanguages } = language;
    const { loading: languageProficiencyLoading, lstLanguageProficiencies } = languageProficiency;

    const languageProficiencyOptions = useMemo(() =>
        OptionsCreator({list: lstLanguageProficiencies, labelKey: 'level'})
    , [lstLanguageProficiencies]);

    const onSubmit = async (data: UserLanguageFormData) => {
        const resultAction = await dispatch(editDeleteUserLanguage(data));

        if (!editDeleteUserLanguage.rejected.match(resultAction)) {
            await dispatch(userLanguageListQuery());
            onClose?.();
        }
    };

    useEffect(() => {
        lstLanguageProficiencies.length === 0 && dispatch(languageProficiencyListQuery());
    }, []);

    const [ languageOptions, setLanguageOptions ] = useState<Option[]>([]);
    
    useEffect(() => {
        const languagesFromEdit = OptionsCreator({list: lstUserLanguages, labelKey: 'language.name', valueKey: 'language.id'});
        const languagesStore = OptionsCreator({list: lstLanguages});
        setLanguageOptions(mergeOptions(languagesFromEdit, languagesStore));
        
    }, [lstUserLanguages, lstLanguages]);

    const fieldConfigs = useMemo(() => [
        {label: 'Language', name: 'lkP_LanguageID', options: languageOptions, fetchAction: languageListQuery, isLoading: languageLoading},
        {label: 'Proficiency', name: 'lkP_LanguageProficiencyID', options: languageProficiencyOptions}
    ], [languageOptions, languageProficiencyOptions, languageLoading, languageProficiencyLoading]);

    const resetItems = useMemo(
        () => mapUserLanguageToForm(lstUserLanguages),
    [lstUserLanguages]);
    
    return (
        <ControlledForm
            schema={userLanguageSchema}
            onSubmit={onSubmit}
            items={[{as: 'FieldArray',name: 'lstLanguages',fields: fieldConfigs}]}
            error={error}
            loading={loading}
            resetItems={resetItems as any}
            indicator={{when: 'Update', while: 'Updating...'}}
        />
    );
}