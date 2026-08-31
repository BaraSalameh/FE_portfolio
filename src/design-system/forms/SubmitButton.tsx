import { LoaderCircle } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';

type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    pending?: boolean;
    pendingLabel?: string;
};

export function SubmitButton({ children, pending = false, pendingLabel = 'Working…', disabled, ...props }: SubmitButtonProps) {
    return (
        <button
            type="submit"
            disabled={disabled || pending}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-accent bg-accent px-5 text-sm font-bold text-white shadow-[0_12px_30px_-16px_var(--ds-accent)] transition hover:-translate-y-0.5 hover:bg-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:translate-y-0 disabled:opacity-60"
            {...props}
        >
            {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
            {pending ? pendingLabel : children}
        </button>
    );
}
