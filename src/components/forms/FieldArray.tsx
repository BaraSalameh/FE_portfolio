"use client";

import { useFieldArray } from "react-hook-form";
import { ControlledDropdown } from "./ControlledDropdown";
import { Button } from "./Button";
import { ResponsiveIcon } from "../ui/ResponsiveIcon";
import { Trash2 } from "lucide-react";
import { FormInput, Header } from "@/components";

export const FieldArray = ({
    name,
    label,
    control,
    fields: fieldConfigs,
    register,
    errors
}: any) => {
    
    const { fields, append, remove } = useFieldArray({
        control,
        name,
    });

    return (
        <div className="space-y-2">
            <h3 className="text-white text-sm font-medium">{label}</h3>
            <Button
                type="button"
                onClick={() => append(
                    fieldConfigs.reduce((acc: any, config: any) => {
                        acc[config.name] = '';
                        return acc;
                    }, {})
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
                        {fieldConfigs.map((config: any) => {
                            switch (config.as as any) {
                                case 'Input':
                                    return (
                                        <FormInput
                                            key={config.name}
                                            label={config.label}
                                            type={config.type || 'text'}
                                            placeholder={config.placeholder}
                                            registration={register(`${name}[${i}].${config.name}`)}
                                            error={ errors?.[name]?.[i]?.[config.name] }
                                            disabled={config?.config?.includes('Disabled')}
                                        />
                                    )
                                case 'Dropdown':
                                    return (
                                        <ControlledDropdown
                                            key={config.name}
                                            name={`${name}[${i}].${config.name}`}
                                            control={control}
                                            label={config.label}
                                            options={config.options || []}
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
