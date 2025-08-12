import { useAppDispatch } from "@/lib/store/hooks";
import { EducationFormData } from "../schema";
import { addEditEducation, educationListQuery } from "../apis";
import { EducationProps } from "../types.education";

export const useHandleSubmit = ({ onClose } : EducationProps) => {
    const dispatch = useAppDispatch();

    return async (data: EducationFormData) => {
        const resultAction = await dispatch(addEditEducation(data));
        
        if (!addEditEducation.rejected.match(resultAction)) {
            await dispatch(educationListQuery());
            onClose?.();
        }
    }
}