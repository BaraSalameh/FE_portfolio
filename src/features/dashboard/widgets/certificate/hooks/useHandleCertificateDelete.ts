import { useAppDispatch } from "@/lib/store/hooks";
import { certificateListQuery, deleteCertificate } from "../apis";

export const useHandleCertificateDelete = () => {
  const dispatch = useAppDispatch();

  return async (id: string) => {
        try {
            await dispatch(deleteCertificate(id));
            await dispatch(certificateListQuery());
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    }
};