import { useAppDispatch } from "@/lib/store/hooks";
import { parentRecordDeleted } from '@/features/dashboard/dashboard.relationships';
import { deleteCertificate } from "../thunks";

export const useHandleCertificateDelete = () => {
  const dispatch = useAppDispatch();

  return async (id: string) => {
        try {
            await dispatch(deleteCertificate(id)).unwrap();
            dispatch(parentRecordDeleted({ kind: 'certificate', id }));
            return true;
        } catch {
            return false;
        }
    }
};
