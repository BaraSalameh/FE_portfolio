'use client';

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { ControlledForm } from "@/components/forms";
import { ContactMessageProps } from "../types.contact-message";
import { ContactMessageFormData, contactMessageSchema } from "../schema";
import { sendEmail } from "../api";

export const ContactMessageForm = ({onClose} : ContactMessageProps) => {

    const dispatch = useAppDispatch();
    const { loading, error, user } = useAppSelector((state) => state.profile);

    const messagePlaceholder = `Dear ${user?.firstname} ${user?.lastname}...`;

    const onSubmit = async (data: ContactMessageFormData) => {
        const resultAction = await dispatch(sendEmail(data));

        if (!sendEmail.rejected.match(resultAction)) {
            onClose?.();
        }
    };

    return (
        <ControlledForm
            schema={contactMessageSchema}
            onSubmit={onSubmit}
            items={[
                {as: 'Input', name: 'emailTo', label: 'To', placeholder: 'john.doe@example.com', type: 'Email', config: ['Disabled']},
                {as: 'Input', name: 'name', label: 'Full name', placeholder: 'John Doe'},
                {as: 'Input', name: 'email', label: 'Email', placeholder: 'john.doe@example.com', type: 'Email'},
                {as: 'Input', name: 'subject', label: 'Subject', placeholder: 'Job oppurtunity'},
                {as: 'Input', name: 'message', label: 'Body', placeholder: messagePlaceholder, type: 'Textarea'}
            ]}
            error={error}
            loading={loading}
            defaultValues={{emailTo: user?.email ?? '', message: `${messagePlaceholder}\n\n`}}
            indicator={{when: 'Send', while: 'Sending...'}}
        />
    );
}