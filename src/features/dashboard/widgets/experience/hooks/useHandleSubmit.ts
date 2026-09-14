import { useAppDispatch } from "@/lib/store/hooks";
import { ExperienceFormData } from "../schema";
import { addEditExperience } from "../thunks";
import { ExperienceProps } from "../types.experience";
import { parentRecordSaved } from "@/features/dashboard/dashboard.relationships";

export const useHandleSubmit = ({ onClose } : ExperienceProps) => {
    const dispatch = useAppDispatch();

    return async (data: ExperienceFormData) => {
        const resultAction = await dispatch(addEditExperience(data));
        
        if (!addEditExperience.rejected.match(resultAction)) {
            dispatch(parentRecordSaved({ kind: 'experience', record: resultAction.payload }));
            onClose?.();
        }
    }
}
