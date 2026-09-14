'use client';

import { useMemo } from "react"
import { EducationResponse } from "../types.education"
import { useAppSelector } from "@/lib/store/hooks"
import { mergeOptions, optionsCreator } from "@/lib/utils";

export const useLoadFieldOfStudy = (educationFromStore?: EducationResponse) => {
    const { lstFields } = useAppSelector(state => state.education.fieldOfStudy);
    return useMemo(() => {
        const { fieldOfStudy } = educationFromStore ?? {};

        const fieldOfStudyFromEdit = optionsCreator({list: fieldOfStudy, badgeKey: 'source'});
        const fieldOfStudyFromStore = optionsCreator({list: lstFields, badgeKey: 'source'});
        return mergeOptions(fieldOfStudyFromEdit, fieldOfStudyFromStore);
    }, [ educationFromStore, lstFields ]);
}
