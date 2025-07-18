import { useAppDispatch } from "@/lib/store/hooks";
import { deleteExperience, experienceListQuery } from "../apis";

export const useHandleExperienceDelete = () => {
  const dispatch = useAppDispatch();

  return async (id: string) => {
        try {
            await dispatch(deleteExperience(id));
            await dispatch(experienceListQuery());
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    }
};