'use client';

import { FormInputProps } from './types.forms';
import { useId, type TextareaHTMLAttributes } from 'react';



export const FormInput = ({
    label,
    registration,
    error,
    ...rest
}: FormInputProps) => {

    const generatedId = useId();
    const inputId = rest.id ?? `${registration?.name ?? label ?? 'field'}-${generatedId}`;
    const errorId = error && inputId ? `${inputId}-error` : undefined;

    const inputClasses = `
        w-full
        px-3.5
        py-2.5
        mt-1
        border border-line
        rounded-xl
        bg-surface-raised text-ink shadow-sm
        transition-colors
        placeholder:text-ink-muted/55
        focus:outline-none
        focus:ring-2
        ${error ? 'border-danger focus:ring-danger/20' : 'focus:border-accent focus:ring-accent/15'}
        ${rest.className}
    `;

    return (
        <div className="space-y-1.5">
            {label ? <label htmlFor={inputId} className="block text-sm font-semibold text-ink">{label}</label> : null}
            {(rest.type === 'textarea' || rest.type === 'Textarea') ? (
                <textarea
                    id={inputId}
                    {...registration}
                    {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
                    className={`${inputClasses} overflow-auto scrollbar-hide`}
                    rows={8}
                    aria-invalid={Boolean(error)}
                    aria-describedby={errorId}
                />
            ) : (
                <input
                    id={inputId}
                    {...registration}
                    {...rest}
                    className={inputClasses}
                    aria-invalid={Boolean(error)}
                    aria-describedby={errorId}
                />
            )}
            {error && <p id={errorId} role="alert" className="text-xs text-danger">{error.message}</p>}
        </div>
    );
};
