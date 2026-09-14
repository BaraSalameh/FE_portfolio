import { useAppDispatch } from "@/lib/store/hooks";
import { parentRecordDeleted } from '@/features/dashboard/dashboard.relationships';
import { deleteEducation } from "../thunks";

export const useHandleEducationDelete = () => {
  const dispatch = useAppDispatch();

  return async (id: string) => {
        try {
            await dispatch(deleteEducation(id)).unwrap();
            dispatch(parentRecordDeleted({ kind: 'education', id }));
            return true;
        } catch {
            return false;
        }
    }
};
