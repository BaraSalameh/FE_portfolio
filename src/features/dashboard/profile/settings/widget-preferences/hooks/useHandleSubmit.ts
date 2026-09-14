import { useAppDispatch } from "@/lib/store/hooks";
import { UserWidgetPreferenceFormData } from "../schema"
import { editUserWidgetPreference, userWidgetPreferenceListQuery } from "../thunks";
import { UserPreferenceProps } from "../types.widget-preferences";
import { useState } from "react";

export const useHandleSubmit = ({ onClose }: Partial<UserPreferenceProps>) => {
    const dispatch = useAppDispatch();
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | string[] | null>(null);
    const [saved, setSaved] = useState(false);
    
    const onSubmit = async (data: UserWidgetPreferenceFormData) => {
        setIsSaving(true);
        setError(null);
        setSaved(false);
        try {
            const resultAction = await dispatch(editUserWidgetPreference(data));
            if (editUserWidgetPreference.rejected.match(resultAction)) {
                setError((resultAction.payload as string | string[] | undefined) ?? 'Could not update this preference.');
                return false;
            }
            await dispatch(userWidgetPreferenceListQuery());
            setSaved(true);
            onClose?.();
            return true;
        } finally {
            setIsSaving(false);
        }
    };

    return { onSubmit, isSaving, error, saved };
}
