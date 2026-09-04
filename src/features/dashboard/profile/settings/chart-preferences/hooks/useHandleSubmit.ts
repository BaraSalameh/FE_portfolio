import { useAppDispatch } from "@/lib/store/hooks";
import { UserChartPreferenceFormData } from "../schema";
import { UserChartPreferenceProps } from "../types.chart-preferences";
import { editUserChartPreference, userChartPreferenceListQuery } from "../thunks";
import { useState } from "react";

export const useHandleSubmit = ({ onClose }: Partial<UserChartPreferenceProps>) => {
    const dispatch = useAppDispatch();
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | string[] | null>(null);
    const [saved, setSaved] = useState(false);
    
    const onSubmit = async (data: UserChartPreferenceFormData) => {
        setIsSaving(true);
        setError(null);
        setSaved(false);
        try {
            const resultAction = await dispatch(editUserChartPreference(data));
            if (editUserChartPreference.rejected.match(resultAction)) {
                setError((resultAction.payload as string | string[] | undefined) ?? 'Could not update this chart preference.');
                return;
            }
            await dispatch(userChartPreferenceListQuery());
            setSaved(true);
            onClose?.();
        } finally {
            setIsSaving(false);
        }
    };

    return { onSubmit, isSaving, error, saved };
}
