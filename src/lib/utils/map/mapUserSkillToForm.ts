import { UserSkillFormData } from "@/features/dashboard/widgets/skill/schema";
import { UserSkillResponse } from "@/features/dashboard/widgets/skill/types.skill";

export const mapUserSkillToForm = (userSkillFromDb: UserSkillResponse[]): UserSkillFormData => {
    return {
        lstUserSkills: userSkillFromDb.map(s => ({
            LKP_SkillID: s.skill.id,
            EducationIDs: s.lstEducations?.map(e => e.id),
            ExperienceIDs: s?.lstExperiences?.map(e => e.id),
            ProjectIDs: s?.lstProjects?.map(p => p.id),
            CertificateIDs: s?.lstCertificates?.map(c => c.id)
        }))
    };
} 