import { PaginatiedAction, Pagination } from "@/components/types.components";
import { AnchorVariantProps } from "@/styles/anchor";
import { ButtonVariantProps } from "@/styles/button";
import React, { InputHTMLAttributes } from "react";
import { Control, FieldError, FieldPath, FieldValues, Path, UseFormRegisterReturn } from "react-hook-form";
import { ActionMeta, MultiValue, SingleValue } from "react-select";
import { z } from "zod";
import { Option } from '@/features/types.features';

type ItemAs = 'Input' | 'Checkbox' | 'Dropdown' | 'DropdownMulti' | 'Modal' | 'FieldArray';
type Type = 'Password' | 'Email' | 'Text' | 'Number' | 'Date' | 'Textarea';
type ModalAs = 'create' | 'update' | 'delete' | 'none';
type Config = 'Disabled';
type ButtonType = 'button' | 'submit' | 'reset';
type ImageType = 'Profile_Picture' | 'Cover_Photo' | 'Certificate_Media';

interface FormModal {
    as: ModalAs;
    children: React.ReactNode;
    title?: string;
    subTitle?: string;
}

export interface FormField {
    as: ItemAs;
    name: string;
    label: string;
    type?: Type;
    placeholder?: string;
    options?: Option[];
    fetchAction?: PaginatiedAction;
    isLoading?: boolean;
}

interface FormItem<T extends z.ZodTypeAny> {
    as: ItemAs;
    label?: string;
    type?: Type;
    placeholder?: string;
    name: Path<z.infer<T>>;
    options?: Option[];
    modal?: FormModal;
    fields?: FormField[];
    config?: Config[];
    fetchAction?: PaginatiedAction;
    isLoading?: boolean;
}

interface FormItemWatch<T extends z.ZodTypeAny> {
    name: Path<z.infer<T>>;
    defaultValue: boolean;
    watched: Path<z.infer<T>>
}

interface Indicator {
    when: string;
    while?: string;
}

export interface ControlledFormProps<T extends z.ZodTypeAny> {
    schema: T;
    onSubmit: (data: z.infer<T>) => void;
    items: FormItem<T>[];
    error?: string | string[] | null;
    loading?: boolean;
    className?: string;
    defaultValues?: Partial<z.infer<T>>;
    watch?: FormItemWatch<T>;
    resetItems?: T;
    indicator?: Indicator;
    children?: React.ReactNode;
}

export interface AnchorProps extends AnchorVariantProps {
    children: React.ReactNode;
    className?: string;
    type?: ButtonType;
    url?: string;
}

export interface ButtonProps extends ButtonVariantProps {
    children: React.ReactNode;
    className?: string;
    type?: ButtonType;
    onClick?: () => void;
    onClose?: () => void;
    url?: string;
    disabled?: boolean;
}

export interface ControlledDropdownProps<T extends FieldValues>  {
    name: FieldPath<T>;
    control: Control<T>;
    label?: string;
    options: Option[];
    isMulti?: boolean;
    fetchAction?: PaginatiedAction;
    isLoading?: boolean;
}

export interface FormCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    registration?: UseFormRegisterReturn;
    error?: FieldError;
}

export interface FormDropdownProps {
    label?: string;
    options: Option[];
    value?: Option | MultiValue<Option>;
    onChange?: (value: MultiValue<Option> | SingleValue<Option>, actionMeta: ActionMeta<Option>) => void;
    onBlur?: () => void;
    error?: FieldError;
    isSearchable?: boolean;
    isClearable?: boolean;
    isLoading?: boolean;
    isMulti?: boolean;
    placeholder?: string;
    fetchAction?: PaginatiedAction;
}

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    registration?: UseFormRegisterReturn;
    error?: FieldError;
}

export interface ImageUploaderProps {
    preset: ImageType;
    onAction?: (url: string) => void;
    onClose?: () => void;
}