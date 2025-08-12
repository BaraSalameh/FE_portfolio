import { useEffect, useState } from "react"
import { EducationResponse } from "../types.education"
import { useAppSelector } from "@/lib/store/hooks"
import { mergeOptions, optionsCreator } from "@/lib/utils";
import { Option } from "@/features/types.features";

export const useLoadFieldOfStudy = (educationFromStore?: EducationResponse) => {
    const { lstFields } = useAppSelector(state => state.education.fieldOfStudy);
    const [ fieldOfStudyOptions, setFieldOfStudyOptions ] = useState<Option[]>([]);

    useEffect(() => {
        const { fieldOfStudy } = educationFromStore ?? {};

        const fieldOfStudyFromEdit = optionsCreator({list: fieldOfStudy});
        const fieldOfStudyFromStore = optionsCreator({list: lstFields});
        setFieldOfStudyOptions(mergeOptions(fieldOfStudyFromEdit, fieldOfStudyFromStore));
    }, [ educationFromStore, lstFields ]);

    return fieldOfStudyOptions;
}