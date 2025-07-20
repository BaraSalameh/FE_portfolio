import { ProjectTechnologyFormData } from "@/features/dashboard/widgets/project/schema";

export const mapProjectTechnologyToForm = (projectTechnologyFromDb: any): ProjectTechnologyFormData => {
    const result = projectTechnologyFromDb
        ?   {
                ...projectTechnologyFromDb,
                EducationID: projectTechnologyFromDb?.education?.id,
                ExperienceID: projectTechnologyFromDb?.experience?.id,
                lstTechnologies: projectTechnologyFromDb.lstTechnologies?.map(
                    (pt: any) => pt.id
                ) ?? []
            }
        : null;
    return result;
}