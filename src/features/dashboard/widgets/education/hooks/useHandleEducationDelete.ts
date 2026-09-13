import { useAppDispatch } from "@/lib/store/hooks";
import { deleteEducation, educationListQuery } from "../thunks";

export const useHandleEducationDelete = () => {
  const dispatch = useAppDispatch();

  return async (id: string) => {
        try {
            await dispatch(deleteEducation(id)).unwrap();
            await dispatch(educationListQuery()).unwrap();
            return true;
        } catch {
            return false;
        }
    }
};
