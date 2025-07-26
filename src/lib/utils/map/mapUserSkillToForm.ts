import { UserSkillFormData } from "@/features/dashboard/widgets/skill/schema";

export const mapUserSkillToForm = (userSkillFromDb: any): UserSkillFormData => {
    const userSkillDto = {
        lstUserSkills: userSkillFromDb.map((s: Record<string, Record<string, string>>) => ({
            LKP_SkillID: s.skill.id,
            EducationID: s?.education?.id,
            ExperienceID: s?.experience?.id,
            ProjectID: s?.project?.id,
            CertificateID: s?.certificate?.id
        }))
    };

    return userSkillDto;
} 