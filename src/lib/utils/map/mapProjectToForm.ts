import { ProjectFormData } from "@/features/dashboard/widgets/project/schema";

export const mapProjectToForm = (projectFromDb: any): ProjectFormData => {
    const result = projectFromDb
        ?   {
                ...projectFromDb,
                EducationID: projectFromDb?.education?.id,
                ExperienceID: projectFromDb?.experience?.id,
                lstSkills: projectFromDb.lstSkills?.map(
                    (s: any) => s.id
                ) ?? []
            }
        : null;
    return result;
}