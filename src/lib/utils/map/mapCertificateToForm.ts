import { CertificateFormData } from "@/features/dashboard/widgets/certificate/schema";
import { CertificateResponse } from "@/features/dashboard/widgets/certificate/types.certificate";

export const mapCertificateToForm = (certificateFromDb?: CertificateResponse): CertificateFormData => {
    return  {
        ...certificateFromDb,
        LKP_CertificateID: certificateFromDb?.certificate.id ?? '',
        issueDate: certificateFromDb?.issueDate ?? '',
        expirationDate: certificateFromDb?.expirationDate ?? '',
        credintialID: certificateFromDb?.credintialID ?? '',
        credintialUrl: certificateFromDb?.credintialUrl ?? '',
        lstSkills: certificateFromDb?.lstSkills?.map(s => s.id ) ?? [],
        lstCertificateMedias: certificateFromDb?.lstCertificateMedias?.map(cm => cm.id) ?? []
    }
}