import { useAppDispatch } from "@/lib/store/hooks";
import { UserLanguageFormData } from "../schema";
import { editDeleteUserLanguage, userLanguageListQuery } from "../apis";
import { UserLanguageProps } from "../types.language";

export const useHandleSubmit = ({ onClose } : UserLanguageProps) => {
    const dispatch = useAppDispatch();

    return async (data: UserLanguageFormData) => {
        const resultAction = await dispatch(editDeleteUserLanguage(data));
        
        if (!editDeleteUserLanguage.rejected.match(resultAction)) {
            await dispatch(userLanguageListQuery());
            onClose?.();
        }
    }
}