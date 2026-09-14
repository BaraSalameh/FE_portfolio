import { useAppDispatch } from "@/lib/store/hooks";
import { parentRecordDeleted } from '@/features/dashboard/dashboard.relationships';
import { deleteExperience } from "../thunks";

export const useHandleExperienceDelete = () => {
  const dispatch = useAppDispatch();

  return async (id: string) => {
        try {
            await dispatch(deleteExperience(id)).unwrap();
            dispatch(parentRecordDeleted({ kind: 'experience', id }));
            return true;
        } catch {
            return false;
        }
    }
};
