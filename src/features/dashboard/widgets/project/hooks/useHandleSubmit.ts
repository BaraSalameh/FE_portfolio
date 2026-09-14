import { useAppDispatch } from "@/lib/store/hooks";
import { ProjectFormData } from "../schema";
import { ProjectProps } from "../types.project";
import { parentRecordSaved } from '@/features/dashboard/dashboard.relationships';
import { addEditProject } from '../thunks';

export const useHandleSubmit = ({ onClose } : ProjectProps) => {
    const dispatch = useAppDispatch();

    return async (data: ProjectFormData) => {
        const resultAction = await dispatch(addEditProject(data));

        if (addEditProject.rejected.match(resultAction)) return;

        dispatch(parentRecordSaved({ kind: 'project', record: resultAction.payload }));
        onClose?.();
    }
}
