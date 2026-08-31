import { CircleAlert } from 'lucide-react';

type FormErrorProps = {
    error?: string | string[] | null;
};

export function FormError({ error }: FormErrorProps) {
    if (!error) return null;
    const messages = Array.isArray(error) ? error : [error];

    return (
        <div role="alert" className="flex gap-2.5 rounded-xl border border-danger/25 bg-danger/8 px-3.5 py-3 text-sm text-danger">
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <div className="space-y-1">
                {messages.map((message) => <p key={message}>{message}</p>)}
            </div>
        </div>
    );
}
