import { useAppDispatch } from "@/lib/store/hooks";
import { UserWidgetPreferenceFormData } from "../schema"
import { editUserWidgetPreference, userWidgetPreferenceListQuery } from "../apis";
import { UserPreferenceProps } from "../types.widget-preferences";

export const useHandleSubmit = ({ onClose }: Partial<UserPreferenceProps>) => {
    const dispatch = useAppDispatch();
    
    return async (data: UserWidgetPreferenceFormData) => {
        const resultAction = await dispatch(editUserWidgetPreference(data));
        
        if (!editUserWidgetPreference.rejected.match(resultAction)) {
            await dispatch(userWidgetPreferenceListQuery());
            onClose?.();
        }
    }
}