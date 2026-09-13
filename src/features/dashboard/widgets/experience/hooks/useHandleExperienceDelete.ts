import { useAppDispatch } from "@/lib/store/hooks";
import { deleteExperience, experienceListQuery } from "../thunks";

export const useHandleExperienceDelete = () => {
  const dispatch = useAppDispatch();

  return async (id: string) => {
        try {
            await dispatch(deleteExperience(id)).unwrap();
            await dispatch(experienceListQuery()).unwrap();
            return true;
        } catch {
            return false;
        }
    }
};
