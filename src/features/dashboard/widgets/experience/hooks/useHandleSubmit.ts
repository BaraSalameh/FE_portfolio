import { useAppDispatch } from "@/lib/store/hooks";
import { ExperienceFormData } from "../schema";
import { addEditExperience, experienceListQuery } from "../apis";
import { ExperienceProps } from "../types.experience";

export const useHandleSubmit = ({ onClose } : ExperienceProps) => {
    const dispatch = useAppDispatch();

    return async (data: ExperienceFormData) => {
        const resultAction = await dispatch(addEditExperience(data));
        
        if (!addEditExperience.rejected.match(resultAction)) {
            await dispatch(experienceListQuery());
            onClose?.();
        }
    }
}