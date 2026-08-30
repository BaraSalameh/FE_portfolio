import { SkillFormData } from "../skill/schema";
import { LKP_CertificateSchemaFormData } from "./schema";


// form
export interface CertificateProps {
    id?: string;
    onClose?: () => void;
}

// slice
export interface CertificateState {
    lstCertificates: CertificateResponse[],
    certificate: certificateState;
    loading: boolean;
    error: string | null;
}

interface certificateState {
    lstCertificates: LKP_CertificateSchemaFormData[];
    certificatesRowCount: number;
    loading: boolean;
    error: string | null;
}

// schema
export interface CertificateResponse {
    id: string;
    certificate: LKP_CertificateSchemaFormData;
    issueDate?: string;
    expirationDate?: string;
    credintialID?: string;
    credintialUrl?: string;
    lstSkills: SkillFormData[];
    lstCertificateMedias: Record<string, string>[];
}
