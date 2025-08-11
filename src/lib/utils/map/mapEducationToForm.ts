import { EducationFormData } from "@/features/dashboard/widgets/education/schema";
import { EducationResponse } from "@/features/dashboard/widgets/education/types.education";

export const mapEducationToForm = (educationFromDb?: EducationResponse): EducationFormData => {
    return   {
        ...educationFromDb,
        startDate: educationFromDb?.startDate?.slice(0, 10) ?? '',
        endDate: educationFromDb?.endDate?.slice(0, 10) ?? '',
        LKP_InstitutionID: educationFromDb?.institution.id ?? '',
        LKP_DegreeID: educationFromDb?.degree.id ?? '',
        LKP_FieldOfStudyID: educationFromDb?.fieldOfStudy?.id ?? '',
        lstSkills: educationFromDb?.lstSkills?.map(s => s.id) ?? []
    }
}