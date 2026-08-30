"use client";

import { Control, FieldArray as FieldArrayValue, FieldArrayPath, FieldError, FieldErrors, FieldPath, FieldValues, UseFormRegister, useFieldArray } from "react-hook-form";
import { ControlledDropdown } from "./ControlledDropdown";
import { Button } from "./Button";
import { ResponsiveIcon } from "../ui/ResponsiveIcon";
import { Trash2 } from "lucide-react";
import { FormInput, Header } from "@/components";
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
        <div className="space-y-2">
            <h3 className="text-white text-sm font-medium">{label}</h3>
            <Button
                type="button"
                onClick={() => prepend(
                    fieldConfigs.reduce<Record<string, string>>((acc, config) => {
                        acc[config.name] = '';
                        return acc;
                    }, {}) as FieldArrayValue<T, FieldArrayPath<T>>
                )}
            >
                <ResponsiveIcon />
                Add new
            </Button>
            <div className="space-y-3">
                {fields.map((field, i) => 
                    <div key={field.id} className="border p-5 rounded-2xl space-y-3">
                        <Header paddingX='none' paddingY='none' itemsX='end'>
                            <ResponsiveIcon icon={Trash2} onClick={() => remove(i)} className="cursor-pointer" />
                        </Header>
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
                    </div>
                )}
            </div>
        </div>
    );
};
