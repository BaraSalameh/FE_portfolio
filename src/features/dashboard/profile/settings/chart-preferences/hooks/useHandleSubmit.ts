import { useAppDispatch } from "@/lib/store/hooks";
import { UserChartPreferenceFormData } from "../schema";
import { UserChartPreferenceProps } from "../types.chart-preferences";
import { editUserChartPreference, userChartPreferenceListQuery } from "../apis";

export const useHandleSubmit = ({ onClose }: Partial<UserChartPreferenceProps>) => {
    const dispatch = useAppDispatch();
    
    return async (data: UserChartPreferenceFormData) => {
        const resultAction = await dispatch(editUserChartPreference(data));

        if (!editUserChartPreference.rejected.match(resultAction)) {
            await dispatch(userChartPreferenceListQuery());
            onClose?.();
        }
    }
}