import { useEffect, useState } from "react"
import { useAppSelector } from "@/lib/store/hooks"
import { mergeOptions, optionsCreator } from "@/lib/utils";
import { Option } from "@/features/types.features";

export const useLoadLanguage = () => {
    const { lstUserLanguages, language } = useAppSelector((state) => state.userLanguage);
    const { lstLanguages } = language;
    const [ languageOptions, setLanguageOptions ] = useState<Option[]>([]);

    useEffect(() => {
        const languagesFromEdit = optionsCreator({list: lstUserLanguages, labelKey: 'language.name', valueKey: 'language.id'});
        const languagesStore = optionsCreator({list: lstLanguages});
        setLanguageOptions(mergeOptions(languagesFromEdit, languagesStore));
    }, [ lstUserLanguages, lstLanguages ]);

    return languageOptions;
}