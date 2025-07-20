import { EducationFormData } from "@/features/dashboard/widgets/education/schema";

export const mapEducationToForm = (educationFromDb: any): EducationFormData => {
    const result = educationFromDb
        ?   {
                ...educationFromDb,
                startDate: educationFromDb.startDate?.slice(0, 10),
                endDate: educationFromDb.endDate?.slice(0, 10),
                LKP_InstitutionID: educationFromDb.institution?.id ?? '',
                LKP_DegreeID: educationFromDb.degree?.id ?? '',
                LKP_FieldOfStudyID: educationFromDb.fieldOfStudy?.id ?? '',
            }
        : null;
    return result;
}