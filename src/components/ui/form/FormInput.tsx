'use client';

import { Paragraph } from '../Paragraph';
import { FormInputProps } from './types';



export const FormInput = ({
    label,
    registration,
    error,
    ...rest
}: FormInputProps) => {

    const inputClasses = `
        w-full
        px-4
        py-2
        mt-1
        border
        rounded-lg
        focus:outline-none
        focus:ring-2
        ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-500 focus:ring-gray-500'}
        ${rest.className}
    `;

    return (
        <div className="space-y-1">
            {label &&
                <label className="block text-sm font-medium text-white-700">
                    <Paragraph>{label}</Paragraph>
                </label>
            }
            {(rest.type === 'textarea' || rest.type === 'Textarea') ? (
                <textarea
                    {...(registration as any)}
                    {...rest}
                    className={`${inputClasses} overflow-auto scrollbar-hide`}
                    rows={8}
                />
            ) : (
                <input
                    {...registration}
                    {...rest}
                    className={inputClasses}
                />
            )}
            {error && <Paragraph intent="danger" size="sm">{error.message}</Paragraph>}
        </div>
    );
};
