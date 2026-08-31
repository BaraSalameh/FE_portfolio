import { cn } from '@/lib/ui/cn';
import type { InputHTMLAttributes } from 'react';
import type { FieldError, UseFormRegisterReturn } from 'react-hook-form';

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> & {
    label: string;
    registration: UseFormRegisterReturn;
    error?: FieldError;
    hint?: string;
};

export function TextField({ label, registration, error, hint, className, id, ...props }: TextFieldProps) {
    const inputId = id ?? registration.name;
    const descriptionId = `${inputId}-description`;

    return (
        <div className="space-y-2">
            <label htmlFor={inputId} className="block text-sm font-semibold text-ink">
                {label}
            </label>
            <input
                id={inputId}
                className={cn(
                    'min-h-12 w-full rounded-xl border border-line bg-surface-raised px-3.5 text-[0.95rem] text-ink shadow-sm outline-none transition placeholder:text-ink-muted/55 hover:border-ink-muted/40 focus:border-accent focus:ring-4 focus:ring-accent/10 disabled:cursor-not-allowed disabled:opacity-60',
                    error && 'border-danger focus:border-danger focus:ring-danger/10',
                    className,
                )}
                aria-invalid={error ? true : undefined}
                aria-describedby={error || hint ? descriptionId : undefined}
                {...registration}
                {...props}
            />
            {(error || hint) && (
                <p id={descriptionId} className={cn('text-xs leading-5 text-ink-muted', error && 'text-danger')}>
                    {error?.message ?? hint}
                </p>
            )}
        </div>
    );
}
