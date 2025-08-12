import { useEffect, useState } from "react"
import { EducationResponse } from "../types.education"
import { useAppSelector } from "@/lib/store/hooks"
import { mergeOptions, optionsCreator } from "@/lib/utils";
import { Option } from "@/features/types.features";

export const useLoadDegree = (educationFromStore?: EducationResponse) => {
    const { lstDegrees } = useAppSelector(state => state.education.degree);
    const [ degreeOptions, setDegreeOptions ] = useState<Option[]>([]);

    useEffect(() => {
        const { degree } = educationFromStore ?? {};

        const degreeFromEdit = optionsCreator({list: degree});
        const degreeFromStore = optionsCreator({list: lstDegrees});
        setDegreeOptions(mergeOptions(degreeFromEdit, degreeFromStore));
    }, [ educationFromStore, lstDegrees ]);

    return degreeOptions;
}