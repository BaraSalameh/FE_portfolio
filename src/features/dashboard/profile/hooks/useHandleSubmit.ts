import { useAppDispatch } from "@/lib/store/hooks";
import { ProfileFormData } from "../schema"
import { editProfile, userInfoQuery } from "../apis";
import { ProjectProps } from "../../widgets/project/types.project";

export const useHandleSubmit = ({ onClose }: ProjectProps) => {
    const dispatch = useAppDispatch();
    
    return async (data: ProfileFormData) => {
        const resultAction = await dispatch(editProfile(data));

        if (!editProfile.rejected.match(resultAction)) {
            await dispatch(userInfoQuery());
            onClose?.();
        }
    }
}