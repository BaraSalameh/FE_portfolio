import { useAppDispatch } from "@/lib/store/hooks";
import { addEditCertificate } from "../thunks";
import { CertificateProps } from "../types.certificate";
import { CertificateFormData } from "../schema";
import { parentRecordSaved } from "@/features/dashboard/dashboard.relationships";

export const useHandleSubmit = ({ onClose } : CertificateProps) => {
    const dispatch = useAppDispatch();

    return async (data: CertificateFormData) => {
        const resultAction = await dispatch(addEditCertificate(data));
        
        if (!addEditCertificate.rejected.match(resultAction)) {
            dispatch(parentRecordSaved({ kind: 'certificate', record: resultAction.payload }));
            onClose?.();
        }
    }
}
