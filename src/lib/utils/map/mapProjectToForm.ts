import { ProjectFormData } from "@/features/dashboard/widgets/project/schema";
import { ProjectResponse } from "@/features/dashboard/widgets/project/types.project";

export const mapProjectToForm = (projectFromDb?: ProjectResponse): ProjectFormData => {
    return {
        ...projectFromDb,
        title: projectFromDb?.title ?? '',
        description: projectFromDb?.description ?? '',
        EducationID: projectFromDb?.education?.id,
        ExperienceID: projectFromDb?.experience?.id,
        lstSkills: projectFromDb?.lstSkills?.map(s => s.id) ?? []
    }
}