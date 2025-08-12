import { useEffect, useState } from "react"
import { useAppSelector } from "@/lib/store/hooks"
import { mergeOptions, optionsCreator } from "@/lib/utils";
import { Option } from "@/features/types.features";
import { EducationResponse } from "../widgets/education/types.education";
import { ExperienceResponse } from "../widgets/experience/types.experience";
import { ProjectResponse } from "../widgets/project/types.project";
import { CertificateResponse } from "../widgets/certificate/types.certificate";
import { UserSkillResponse } from "../widgets/skill/types.skill";

type FromStore = UserSkillResponse[] | EducationResponse | ExperienceResponse | ProjectResponse | CertificateResponse;

export const useLoadUserSkill = (fromStore?: FromStore) => {
    const { lstSkills } = useAppSelector((state) => state.userSkill.skill);
    const [skillOptions, setSkillOptions] = useState<Option[]>([]);

    useEffect(() => {
        let skillsFromEdit: Option[] = [];

        if (Array.isArray(fromStore)) {
            // fromStore is UserSkillResponse[]
            skillsFromEdit = optionsCreator({ list: fromStore.map(us => us.skill), iconKey: 'iconUrl' });
        } else if (fromStore && 'lstSkills' in fromStore) {
            // fromStore is one of the *Response* types with lstSkills property
            skillsFromEdit = optionsCreator({ list: fromStore.lstSkills, iconKey: 'iconUrl' });
        }

        const skillsStore = optionsCreator({ list: lstSkills, iconKey: 'iconUrl' });
        setSkillOptions(mergeOptions(skillsFromEdit, skillsStore));

    }, [fromStore, lstSkills]);

    return skillOptions;
};
