
import { useAppDispatch } from "@/lib/store/hooks";
import { deleteMessage } from "../api/deleteMessage";
import { removeMessage } from "../slice";

export const useMessageDelete = () => {
  const dispatch = useAppDispatch();

  return async (id: string) => {
        try {
            await dispatch(deleteMessage(id));
            dispatch(removeMessage(id));
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    }
};