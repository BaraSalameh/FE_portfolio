import { UserSkillFormData } from "@/features/dashboard/widgets/skill/schema";
import { UserSkillResponse } from "@/features/dashboard/widgets/skill/types.skill";

export const mapUserSkillToForm = (userSkillFromDb: UserSkillResponse[]): UserSkillFormData => {
    const userSkillDto = {
        lstUserSkills: userSkillFromDb.map(s => ({
            LKP_SkillID: s.skill.id,
            EducationID: s?.education?.id,
            ExperienceID: s?.experience?.id,
            ProjectID: s?.project?.id,
            CertificateID: s?.certificate?.id
        }))
    };

    return userSkillDto;
} 