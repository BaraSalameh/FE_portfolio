import { useAppDispatch } from "@/lib/store/hooks";
import { addEditCertificate, certificateListQuery } from "../apis";
import { CertificateProps } from "../types.certificate";
import { CertificateFormData } from "../schema";

export const useHandleSubmit = ({ onClose } : CertificateProps) => {
    const dispatch = useAppDispatch();

    return async (data: CertificateFormData) => {
        const resultAction = await dispatch(addEditCertificate(data));
        
        if (!addEditCertificate.rejected.match(resultAction)) {
            await dispatch(certificateListQuery());
            onClose?.();
        }
    }
}