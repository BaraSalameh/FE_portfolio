'use client';

import { FieldArrayPath, FieldError, FieldPathValue, FormProvider, Path, useForm, useWatch } from "react-hook-form";
import { ControlledFormProps } from "./types.forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormInput } from "./FormInput";
import { FormCheckbox } from "./FormCheckbox";
import { ControlledDropdown } from "./ControlledDropdown";
import { useEffect } from "react";
import { ActionDialog as CUDModal } from '@/design-system';
import { FieldArray } from './FieldArray';
import React from "react";
import { extractPathValue } from "@/lib/utils";

export const ControlledForm = <T extends z.ZodTypeAny> ({ 
    schema,
    onSubmit,
    items,
    error,
    loading,
    className,
    defaultValues,
    watch,
    resetItems,
    indicator,
    children
}: ControlledFormProps<T>) => {

    const methods = useForm<z.infer<T>>({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as z.infer<T>,
    });

    const {
        control,
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = methods;

    const toWatch = useWatch({
        control,
        name: (watch?.name ?? '') as Path<z.infer<T>>,
        defaultValue: watch?.defaultValue as FieldPathValue<z.infer<T>, Path<z.infer<T>>>,
        disabled: !watch,
    });

    useEffect(() => {
        if(resetItems) {
            reset(resetItems);
        }
    }, [reset, resetItems]);

    return (
        <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className={`relative space-y-5 ${className ?? ''}`} aria-busy={loading}>
            {children}
            <fieldset disabled={loading} className="space-y-4">
            {
                items.map((item, index) => {
                    const fieldError = extractPathValue(errors, item.name) as FieldError | undefined;
                    if(toWatch && watch?.watched === item.name && watch.defaultValue !== toWatch) return null;

                    switch (item.as) {
                        case 'Input':
                            return (
                                <FormInput
                                key={index}
                                label={item.label}
                                type={(item.type || 'text').toLowerCase()}
                                placeholder={item.placeholder}
                                registration={register(item.name)}
                                error={fieldError}
                                disabled={item.config?.includes('Disabled')}
                                autoComplete={
                                    item.name === 'email' || item.name === 'reEmail' ? 'email'
                                    : item.name === 'password' ? (indicator?.when === 'Register' ? 'new-password' : 'current-password')
                                    : item.name === 'firstname' ? 'given-name'
                                    : item.name === 'lastname' ? 'family-name'
                                    : item.name === 'phone' ? 'tel'
                                    : undefined
                                }
                                />
                            )
                        case 'Checkbox':
                            return (
                                <FormCheckbox
                                    key={index}
                                    label={item.label}
                                    registration={register(item.name)}
                                    error={fieldError}
                                />
                            )
                        case 'Dropdown':
                        case 'DropdownMulti':
                            return (
                                <ControlledDropdown
                                    key={index}
                                    control={control}
                                    name={item.name}
                                    label={item.label}
                                    options={item.options || []}
                                    isMulti={item.as === 'DropdownMulti'}
                                    fetchAction={item.fetchAction}
                                    isLoading={item.isLoading}
                                />
                            )
                        case 'Modal':
                            return (
                                <CUDModal key={index} as={item.modal?.as} title={item.modal?.title} subTitle={item.modal?.subTitle} error={fieldError}>
                                    {React.isValidElement<{ onAction?: (value: unknown) => void }>(item.modal?.children)
                                        ?   React.cloneElement(item.modal.children, {
                                                onAction: item.modal.children.props.onAction ?? ((value) => setValue(
                                                    item.name,
                                                    value as FieldPathValue<z.infer<T>, typeof item.name>,
                                                ))
                                            })
                                        :   item.modal?.children
                                    }
                                </CUDModal>
                            )
                        case 'FieldArray':
                            return (
                                <FieldArray
                                    key={index}
                                    name={item.name as FieldArrayPath<z.infer<T>>}
                                    label={item.label}
                                    control={control}
                                    errors={errors}
                                    fields={item.fields ?? []}
                                    register={register}
                                />
                            )
                        default: return null;
                    }
                })
            }
            </fieldset>
            {Array.isArray(error) && error.length > 1 ? (
                <div role="alert">
                    <ul className="list-disc space-y-1 pl-5 text-sm text-danger">
                        {error.map((e: string, i: number) => (
                            <li key={i}>{e}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                error && <p role="alert" className="text-sm text-danger">{error}</p>
            )}

            <button type="submit" disabled={loading} className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-accent px-5 text-sm font-bold text-white shadow-[0_10px_24px_-14px_var(--ds-accent)] transition hover:bg-accent-strong disabled:opacity-60 sm:w-auto">
                {loading ? indicator?.while || 'Submitting…' : indicator?.when || 'Submit'}
            </button>
        </form>
        </FormProvider>
    )
}
