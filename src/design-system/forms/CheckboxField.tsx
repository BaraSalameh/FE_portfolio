import type { InputHTMLAttributes } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';

type CheckboxFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'name' | 'type'> & {
    label: string;
    registration: UseFormRegisterReturn;
};

export function CheckboxField({ label, registration, id, ...props }: CheckboxFieldProps) {
    const inputId = id ?? registration.name;

    return (
        <label htmlFor={inputId} className="inline-flex cursor-pointer items-center gap-2.5 text-sm text-ink-muted">
            <input
                id={inputId}
                type="checkbox"
                className="size-4 rounded border-line bg-surface text-accent accent-accent focus:ring-2 focus:ring-accent/30"
                {...registration}
                {...props}
            />
            {label}
        </label>
    );
}
