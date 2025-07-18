import { useAppDispatch } from "@/lib/store/hooks";
import { deleteProject, projectTechnologyListQuery } from "../apis";

export const useHandleProjectDelete = () => {
  const dispatch = useAppDispatch();

  return async (id: string) => {
        try {
            await dispatch(deleteProject(id));
            await dispatch(projectTechnologyListQuery());
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    }
};