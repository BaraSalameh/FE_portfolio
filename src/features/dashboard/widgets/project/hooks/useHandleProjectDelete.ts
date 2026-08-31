import { useAppDispatch } from "@/lib/store/hooks";
import { deleteProjectAction } from '../project.actions';
import { projectMutationFailed, projectMutationStarted, projectMutationSucceeded } from '../slice';

export const useHandleProjectDelete = () => {
  const dispatch = useAppDispatch();

  return async (id: string) => {
        dispatch(projectMutationStarted());
        const result = await deleteProjectAction(id);

        if (!result.success) {
            dispatch(projectMutationFailed(result.error));
            return;
        }
        dispatch(projectMutationSucceeded(result.data));
    }
};
