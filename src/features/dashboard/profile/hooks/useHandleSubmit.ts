import { useAppDispatch } from "@/lib/store/hooks";
import { ProfileFormData } from "../schema"
import { editProfile } from "../thunks";
import { ProjectProps } from "../../widgets/project/types.project";
import { useState } from "react";

export const useHandleSubmit = ({ onClose }: ProjectProps) => {
    const dispatch = useAppDispatch();
    const [saved, setSaved] = useState(false);

    const onSubmit = async (data: ProfileFormData) => {
        setSaved(false);
        const resultAction = await dispatch(editProfile(data));

        if (editProfile.rejected.match(resultAction)) {
            return false;
        }

        setSaved(true);
        onClose?.();
        return true;
    };

    return { onSubmit, saved, dismissSaved: () => setSaved(false) };
}
