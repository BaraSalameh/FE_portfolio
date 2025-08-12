import { useAppDispatch } from "@/lib/store/hooks";
import { UserSkillFormData } from "../schema";
import { editDeleteUserSkill, userSkillListQuery } from "../apis";
import { SkillProps } from "../types.skill";

export const useHandleSubmit = ({ onClose } : SkillProps) => {
    const dispatch = useAppDispatch();

    return async (data: UserSkillFormData) => {
        const resultAction = await dispatch(editDeleteUserSkill(data));
                
        if (!editDeleteUserSkill.rejected.match(resultAction)) {
            await dispatch(userSkillListQuery());
            onClose?.();
        }
    }
}