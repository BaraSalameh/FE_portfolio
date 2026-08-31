import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { signMessage } from '../thunks/signMessage';
import { markMessage } from "../slice";

export const useSignMessage = () => {
    const dispatch = useAppDispatch();
    const { lstMessages } = useAppSelector(state => state.contactMessage);

    return async (id: string) => {
        const currentMessage = lstMessages.find((message) => message.id === id);
        if(!currentMessage?.isRead)
            try {
                await dispatch(signMessage(id));
                dispatch(markMessage(id));
            } catch (err) {
                console.error('Failed to delete:', err);
            }
        }
};
