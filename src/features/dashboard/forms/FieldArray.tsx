"use client";

import { Control, FieldArray as FieldArrayValue, FieldArrayPath, FieldError, FieldErrors, FieldPath, FieldValues, UseFormRegister, useFieldArray } from "react-hook-form";
import { ControlledDropdown } from "./ControlledDropdown";
import { Plus, Trash2 } from 'lucide-react';
import { FormInput } from './FormInput';
import { FormField } from "./types.forms";
import { extractPathValue } from "@/lib/utils";

interface FieldArrayProps<T extends FieldValues> {
    name: FieldArrayPath<T>;
    label?: string;
    control: Control<T>;
    fields: FormField[];
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
}

export const FieldArray = <T extends FieldValues>({
    name,
    label,
    control,
    fields: fieldConfigs,
    register,
    errors
}: FieldArrayProps<T>) => {
    
    const { fields, prepend, remove } = useFieldArray({
        control,
        name,
    });

    return (
        <fieldset className="space-y-3">
            {label ? <legend className="text-sm font-semibold text-ink">{label}</legend> : null}
            <button
                type="button"
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-line bg-surface-raised px-3.5 text-sm font-semibold text-ink shadow-sm transition hover:border-accent/30 hover:bg-canvas-subtle"
                onClick={() => prepend(
                    fieldConfigs.reduce<Record<string, string | string[]>>((acc, config) => {
                        acc[config.name] = config.as === 'DropdownMulti' ? [] : '';
                        return acc;
                    }, {}) as FieldArrayValue<T, FieldArrayPath<T>>
                )}
            >
                <Plus className="size-4" aria-hidden="true" />
                Add {label ? label.toLowerCase().replace(/s$/, '') : 'item'}
            </button>
            <p className="text-xs text-ink-muted" aria-live="polite">{fields.length === 0 ? `No ${label?.toLowerCase() ?? 'items'} added yet.` : `${fields.length} ${fields.length === 1 ? 'entry' : 'entries'}`}</p>
            <div className="space-y-3">
                {fields.map((field, i) => 
                    <fieldset key={field.id} className="space-y-3 rounded-2xl border border-line bg-canvas-subtle/40 p-4 sm:p-5">
                        <div className="flex justify-end">
                            <button type="button" onClick={() => remove(i)} className="rounded-lg p-2 text-danger hover:bg-danger/10" aria-label={`Remove ${label ?? 'item'} ${i + 1}`}>
                                <Trash2 className="size-4" aria-hidden="true" />
                            </button>
                        </div>
                        {fieldConfigs.map((config) => {
                            const fieldPath = `${name}.${i}.${config.name}` as FieldPath<T>;
                            const fieldError = extractPathValue(errors, fieldPath) as FieldError | undefined;
                            switch (config.as) {
                                case 'Input':
                                    return (
                                        <FormInput
                                            key={config.name}
                                            label={config.label}
                                            type={config.type || 'text'}
                                            placeholder={config.placeholder}
                                            description={config.description}
                                            registration={register(fieldPath)}
                                            error={fieldError}
                                            disabled={config?.config?.includes('Disabled')}
                                        />
                                    )
                                case 'Dropdown':
                                case 'DropdownMulti':
                                    return (
                                        <ControlledDropdown
                                            key={config.name}
                                            name={fieldPath}
                                            control={control}
                                            label={config.label}
                                            options={config.options || []}
                                            isMulti={config.as === 'DropdownMulti'}
                                            fetchAction={config.fetchAction}
                                            isLoading={config.isLoading}
                                        />
                                    )
                                default: return null;
                            }
                        })}
                    </fieldset>
                )}
            </div>
        </fieldset>
    );
};
