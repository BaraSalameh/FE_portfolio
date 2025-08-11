import { ExperienceFormData } from "@/features/dashboard/widgets/experience/schema";
import { ExperienceResponse } from "@/features/dashboard/widgets/experience/types.experience";

export const mapExperienceToForm = (experienceFromDb?: ExperienceResponse): ExperienceFormData => {
    return {
        ...experienceFromDb,
        jobTitle: experienceFromDb?.jobTitle ?? '',
        companyName: experienceFromDb?.companyName ?? '',
        startDate: experienceFromDb?.startDate?.slice(0, 10) ?? '',
        endDate: experienceFromDb?.endDate?.slice(0, 10) ?? '',
        location: experienceFromDb?.location ?? '',
        lstSkills: experienceFromDb?.lstSkills?.map(s => s.id) ?? []
    }
}