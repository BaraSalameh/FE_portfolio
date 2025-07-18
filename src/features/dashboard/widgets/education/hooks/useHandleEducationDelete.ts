import { useAppDispatch } from "@/lib/store/hooks";
import { deleteEducation, educationListQuery } from "../apis";

export const useHandleEducationDelete = () => {
  const dispatch = useAppDispatch();

  return async (id: string) => {
        try {
            await dispatch(deleteEducation(id));
            await dispatch(educationListQuery());
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    }
};