import { useAppDispatch } from "@/lib/store/hooks";
import { deleteProject, projectListQuery } from "../apis";

export const useHandleProjectDelete = () => {
  const dispatch = useAppDispatch();

  return async (id: string) => {
        try {
            await dispatch(deleteProject(id));
            await dispatch(projectListQuery());
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    }
};