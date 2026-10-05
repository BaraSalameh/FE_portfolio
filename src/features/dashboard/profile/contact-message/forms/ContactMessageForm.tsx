'use client';

import { ControlledForm } from '@/features/dashboard/forms';
import { useAppSelector } from '@/lib/store/hooks';
import { ContactMessageProps } from "../types.contact-message";
import { contactMessageSchema } from "../schema";
import { useHandleSubmit } from "../hooks";

export const ContactMessageForm = ({ onClose }: ContactMessageProps) => {
    const user = useAppSelector((state) => state.profile.user);
    const recipientName = `${user?.firstname ?? ''} ${user?.lastname ?? ''}`.trim();
    const messagePlaceholder = `Dear ${recipientName || 'portfolio owner'}...`;

    const onSubmit = useHandleSubmit({ onClose });

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
            defaultValues={{ emailTo: user?.email ?? '', message: `${messagePlaceholder}\n\n` }}
            indicator={{when: 'Send', while: 'Sending...'}}
        />
    );
}
