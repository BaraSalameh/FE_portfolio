import { useAppDispatch } from "@/lib/store/hooks";
import { certificateListQuery, deleteCertificate } from "../thunks";

export const useHandleCertificateDelete = () => {
  const dispatch = useAppDispatch();

  return async (id: string) => {
        try {
            await dispatch(deleteCertificate(id)).unwrap();
            await dispatch(certificateListQuery()).unwrap();
            return true;
        } catch {
            return false;
        }
    }
};
