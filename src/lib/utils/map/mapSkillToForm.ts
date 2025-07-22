import { SkillFormData } from "@/features/dashboard/widgets/skill/schema";

export const mapSkillToForm = (skillFromDb: any): SkillFormData => {
    const skillDto = {
        lstSkills: skillFromDb.map((s: Record<string, Record<string, string>>) => ({
            lkP_SkillID: s.skill.id,
            EducationID: s?.education?.id,
            ExperienceID: s?.experience?.id,
            ProjectID: s?.project?.id,
            proficiency: s.proficiency,
            description: s?.description
        }))
    };
    return skillDto;
}