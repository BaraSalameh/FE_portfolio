'use client';

import { Paragraph } from '../ui/Paragraph';
import { FormCheckboxProps } from './types.forms';

export const FormCheckbox = ({
    label,
    registration,
    error,
    ...rest
}: FormCheckboxProps) => {
    return (
        <div className="flex items-center space-x-2">
            <input
                id={label}
                type="checkbox"
                {...registration}
                {...rest}
                className={`h-5 w-4 accent-green-700 cursor-pointer`}
            />
            {label && (
                <label htmlFor={label}>
                    <Paragraph className="text-sm">{label}</Paragraph>
                </label>
            )}
            {error && <Paragraph intent="danger" className="text-sm">{error.message}</Paragraph>}
        </div>
    );
};
