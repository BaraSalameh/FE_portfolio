'use client';

import { FormCheckboxProps } from './types.forms';
import { useId } from 'react';

export const FormCheckbox = ({
    label,
    registration,
    error,
    ...rest
}: FormCheckboxProps) => {
    const generatedId = useId();
    const inputId = rest.id ?? registration?.name ?? generatedId;
    const errorId = error ? `${inputId}-error` : undefined;
    return (
        <div className="space-y-1.5">
        <div className="flex min-h-11 items-center gap-3">
            <input
                id={inputId}
                type="checkbox"
                {...registration}
                {...rest}
                className="size-5 shrink-0 cursor-pointer rounded border-line accent-accent"
                aria-invalid={Boolean(error)}
                aria-describedby={errorId}
            />
            {label && (
                <label htmlFor={inputId} className="cursor-pointer text-sm text-ink-muted">{label}</label>
            )}
        </div>
        {error ? <p id={errorId} role="alert" className="text-xs text-danger">{error.message}</p> : null}
        </div>
    );
};
