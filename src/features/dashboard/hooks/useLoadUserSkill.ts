import { useEffect, useState } from "react"
import { useAppSelector } from "@/lib/store/hooks"
import { mergeOptions, optionsCreator } from "@/lib/utils";
import { Option } from "@/features/types.features";
import { EducationResponse } from "../widgets/education/types.education";
import { ExperienceResponse } from "../widgets/experience/types.experience";
import { ProjectResponse } from "../widgets/project/types.project";
import { CertificateResponse } from "../widgets/certificate/types.certificate";

type FromStore = EducationResponse | ExperienceResponse | ProjectResponse | CertificateResponse;

export const useLoadUserSkill = (fromStore?: FromStore) => {
    const { lstSkills } = useAppSelector((state) => state.userSkill.skill);
    const [ skillOptions, setSkillOptions ] = useState<Option[]>([]);

    useEffect(() => {
        const { lstSkills: lsfe } = fromStore ?? {};
        const skillsFromEdit = lsfe ? optionsCreator({list: lsfe, iconKey: 'iconUrl'}) : [];
        const skillsStore = optionsCreator({list: lstSkills, iconKey: 'iconUrl'});
        setSkillOptions(mergeOptions(skillsFromEdit, skillsStore));

    }, [fromStore, lstSkills]);

    return skillOptions;
}