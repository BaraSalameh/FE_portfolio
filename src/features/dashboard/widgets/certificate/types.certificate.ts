import { CertificateFormData, LKP_CertificateSchemaFormData } from "./schema";


// form
export interface CertificateProps {
    id?: string;
    onClose?: () => void;
}

// slice
export interface CertificateState {
    lstCertificates: CertificateFormData[],
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