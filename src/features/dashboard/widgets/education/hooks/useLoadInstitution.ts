'use client';

import { useMemo } from "react"
import { EducationResponse } from "../types.education"
import { useAppSelector } from "@/lib/store/hooks"
import { mergeOptions, optionsCreator } from "@/lib/utils";

export const useLoadInstitution = (educationFromStore?: EducationResponse) => {
    const { lstInstitutions } = useAppSelector(state => state.education.institution);
    return useMemo(() => {
        const { institution } = educationFromStore ?? {};

        const institutionFromEdit = optionsCreator({list: institution, badgeKey: 'source', descriptionKey: 'countryName' });
        const institutionFromStore = optionsCreator({list: lstInstitutions, badgeKey: 'source', descriptionKey: 'countryName'});
        return mergeOptions(institutionFromEdit, institutionFromStore);
    }, [ educationFromStore, lstInstitutions ]);
}
