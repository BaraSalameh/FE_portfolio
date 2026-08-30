'use client';

import { useMemo } from "react"
import { useAppSelector } from "@/lib/store/hooks"
import { mergeOptions, optionsCreator } from "@/lib/utils";
import { EducationResponse } from "../widgets/education/types.education";
import { ExperienceResponse } from "../widgets/experience/types.experience";
import { ProjectResponse } from "../widgets/project/types.project";
import { CertificateResponse } from "../widgets/certificate/types.certificate";
import { UserSkillResponse } from "../widgets/skill/types.skill";
import { Option } from "@/features/types.features";

type FromStore = UserSkillResponse[] | EducationResponse | ExperienceResponse | ProjectResponse | CertificateResponse;

export const useLoadUserSkill = (fromStore?: FromStore) => {
    const { lstSkills } = useAppSelector((state) => state.userSkill.skill);
    return useMemo(() => {
        let skillsFromEdit: Option[] = [];

        if (Array.isArray(fromStore)) {
            // fromStore is UserSkillResponse[]
            skillsFromEdit = optionsCreator({ list: fromStore.map(us => us.skill), iconKey: 'iconUrl' });
        } else if (fromStore && 'lstSkills' in fromStore) {
            // fromStore is one of the *Response* types with lstSkills property
            skillsFromEdit = optionsCreator({ list: fromStore.lstSkills, iconKey: 'iconUrl' });
        }

        const skillsStore = optionsCreator({ list: lstSkills, iconKey: 'iconUrl' });
        return mergeOptions(skillsFromEdit, skillsStore);
    }, [fromStore, lstSkills]);
};
