import { useAppDispatch } from "@/lib/store/hooks";
import { ContactMessageFormData } from "../schema";
import { sendEmail } from "../api";
import { ContactMessageProps } from "../types.contact-message";

export const useHandleSubmit = ({ onClose }: Partial<ContactMessageProps>) => {
    const dispatch = useAppDispatch();

    return async (data: ContactMessageFormData) => {
        const resultAction = await dispatch(sendEmail(data));

        if (!sendEmail.rejected.match(resultAction)) {
            onClose?.();
        }
    }
}