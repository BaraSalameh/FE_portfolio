import { ProjectTechnologyFormData } from "@/features/dashboard/widgets/project/schema";

export const mapCertificateToForm = (certificateFromDb: any): ProjectTechnologyFormData => {
    const result = certificateFromDb
        ?   {
                ...certificateFromDb,
                LKP_CertificateID: certificateFromDb?.certificate.id,
                issueDate: certificateFromDb?.issueDate,
                expirationDate: certificateFromDb?.expirationDate,
                credintialID: certificateFromDb?.credintialID,
                credintialUrl: certificateFromDb?.credintialUrl,
                lstSkills: certificateFromDb.lstSkills?.map(
                    (s: any) => s.id
                ) ?? [],
                lstCertificateMedias: certificateFromDb.lstCertificateMedias?.map(
                    (cm: any) => cm.id
                ) ?? []
            }
        : null;
    return result;
}