import { useAppDispatch } from "@/lib/store/hooks";
import { ProjectFormData } from "../schema";
import { addEditProject, projectListQuery } from "../apis";
import { ProjectProps } from "../types.project";

export const useHandleSubmit = ({ onClose } : ProjectProps) => {
    const dispatch = useAppDispatch();

    return async (data: ProjectFormData) => {
        const resultAction = await dispatch(addEditProject(data));
        
        if (!addEditProject.rejected.match(resultAction)) {
            await dispatch(projectListQuery());
            onClose?.();
        }
    }
}