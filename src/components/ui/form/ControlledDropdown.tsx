"use client";

import { getSelectedOption } from "@/lib/utils/appFunctions";
import { Controller, FieldValues } from "react-hook-form";
import { FormDropdown } from "./FormDropdown";
import { ControlledDropdownProps, Option } from "./types";
import { useState } from "react";

export const ControlledDropdown = <T extends FieldValues>({
    name,
    control,
    label,
    options,
    isMulti = false,
    fetchAction,
    isLoading
}: ControlledDropdownProps<T>) => {

    const [values, setValues] = useState<Option[]>();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => {
                const selectedValue = getSelectedOption(options, field.value);

                return (
                    <FormDropdown
                        label={label}
                        options={options}
                        value={values ?? selectedValue}
                        onChange={(option) => {
                            if (isMulti) {
                                setValues(option as Option[]);
                                const selectedIds = (option as Option[])?.map(opt => opt.value) ?? [];
                                field.onChange(selectedIds);
                            } else {
                                field.onChange((option as Option)?.value ?? null);
                            }
                        }}
                        onBlur={field.onBlur}
                        error={fieldState.error}
                        isMulti={isMulti}
                        fetchAction={fetchAction}
                        isLoading={isLoading ?? options.length === 0}
                    />
                );
            }}
        />
    );
};