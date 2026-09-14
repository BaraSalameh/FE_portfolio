import { useAppDispatch } from "@/lib/store/hooks";
import { parentRecordDeleted } from '@/features/dashboard/dashboard.relationships';
import { deleteProject } from '../thunks';

export const useHandleProjectDelete = () => {
  const dispatch = useAppDispatch();

  return async (id: string) => {
        try {
            await dispatch(deleteProject(id)).unwrap();
            dispatch(parentRecordDeleted({ kind: 'project', id }));
            return true;
        } catch {
            return false;
        }
    }
};
