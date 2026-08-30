'use client';

import { useMemo } from "react"
import { EducationResponse } from "../types.education"
import { useAppSelector } from "@/lib/store/hooks"
import { mergeOptions, optionsCreator } from "@/lib/utils";

export const useLoadDegree = (educationFromStore?: EducationResponse) => {
    const { lstDegrees } = useAppSelector(state => state.education.degree);
    return useMemo(() => {
        const { degree } = educationFromStore ?? {};

        const degreeFromEdit = optionsCreator({list: degree});
        const degreeFromStore = optionsCreator({list: lstDegrees});
        return mergeOptions(degreeFromEdit, degreeFromStore);
    }, [ educationFromStore, lstDegrees ]);
}
