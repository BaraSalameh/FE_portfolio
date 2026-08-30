'use client';

import { useMemo } from "react"
import { useAppSelector } from "@/lib/store/hooks"
import { mergeOptions, optionsCreator } from "@/lib/utils";

export const useLoadLanguage = () => {
    const { lstUserLanguages, language } = useAppSelector((state) => state.userLanguage);
    const { lstLanguages } = language;
    return useMemo(() => {
        const languagesFromEdit = optionsCreator({list: lstUserLanguages, labelKey: 'language.name', valueKey: 'language.id'});
        const languagesStore = optionsCreator({list: lstLanguages});
        return mergeOptions(languagesFromEdit, languagesStore);
    }, [ lstUserLanguages, lstLanguages ]);
}
