import { useEffect, useState } from "react"
import { EducationResponse } from "../types.education"
import { useAppSelector } from "@/lib/store/hooks"
import { mergeOptions, optionsCreator } from "@/lib/utils";
import { Option } from "@/features/types.features";

export const useLoadInstitution = (educationFromStore?: EducationResponse) => {
    const { lstInstitutions } = useAppSelector(state => state.education.institution);
    const [ institutionOptions, setInstitutionOptions ] = useState<Option[]>([]);

    useEffect(() => {
        const { institution } = educationFromStore ?? {};

        const institutionFromEdit = optionsCreator({list: institution });
        const institutionFromStore = optionsCreator({list: lstInstitutions});
        setInstitutionOptions(mergeOptions(institutionFromEdit, institutionFromStore));
    }, [ educationFromStore, lstInstitutions ]);

    return institutionOptions;
}