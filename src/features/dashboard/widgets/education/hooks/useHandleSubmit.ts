import { useAppDispatch } from "@/lib/store/hooks";
import { EducationFormData } from "../schema";
import { addEditEducation } from "../thunks";
import { EducationProps } from "../types.education";
import { parentRecordSaved } from "@/features/dashboard/dashboard.relationships";

export const useHandleSubmit = ({ onClose } : EducationProps) => {
    const dispatch = useAppDispatch();

    return async (data: EducationFormData) => {
        const resultAction = await dispatch(addEditEducation(data));
        
        if (!addEditEducation.rejected.match(resultAction)) {
            dispatch(parentRecordSaved({ kind: 'education', record: resultAction.payload }));
            onClose?.();
        }
    }
}
