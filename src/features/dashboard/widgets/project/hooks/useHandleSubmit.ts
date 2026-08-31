import { useAppDispatch } from "@/lib/store/hooks";
import { ProjectFormData } from "../schema";
import { ProjectProps } from "../types.project";
import { saveProjectAction } from '../project.actions';
import { projectMutationFailed, projectMutationStarted, projectMutationSucceeded } from '../slice';

export const useHandleSubmit = ({ onClose } : ProjectProps) => {
    const dispatch = useAppDispatch();

    return async (data: ProjectFormData) => {
        dispatch(projectMutationStarted());
        const result = await saveProjectAction(data);

        if (!result.success) return dispatch(projectMutationFailed(result.error));

        dispatch(projectMutationSucceeded(result.data));
        onClose?.();
    }
}
