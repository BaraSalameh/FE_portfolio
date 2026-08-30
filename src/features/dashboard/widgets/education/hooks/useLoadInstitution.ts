'use client';

import { useMemo } from "react"
import { EducationResponse } from "../types.education"
import { useAppSelector } from "@/lib/store/hooks"
import { mergeOptions, optionsCreator } from "@/lib/utils";

export const useLoadInstitution = (educationFromStore?: EducationResponse) => {
    const { lstInstitutions } = useAppSelector(state => state.education.institution);
    return useMemo(() => {
        const { institution } = educationFromStore ?? {};

        const institutionFromEdit = optionsCreator({list: institution });
        const institutionFromStore = optionsCreator({list: lstInstitutions});
        return mergeOptions(institutionFromEdit, institutionFromStore);
    }, [ educationFromStore, lstInstitutions ]);
}
