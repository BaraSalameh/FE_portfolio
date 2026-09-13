"use client";

import { components, GroupBase, MultiValueProps, OptionProps, SingleValueProps } from 'react-select';
import Image from 'next/image';
import { Option } from '@/features/types.features';

export const CustomOption = (props: OptionProps<Option, boolean, GroupBase<Option>>) => {
    const { data } = props;
    return (
        <components.Option {...props}>
            <span className="flex items-center gap-2 text-sm">
                {data.icon && <Image src={data.icon} alt="" width={16} height={16} className="size-4 rounded-full" />}
                <span className="min-w-0 flex-1">
                    <span className="block truncate">{data.label}</span>
                    {data.description && <span className="block truncate text-xs opacity-70">{data.description}</span>}
                </span>
                {data.badge && data.badge.toLowerCase() !== 'internal' && (
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                        {data.badge}
                    </span>
                )}
            </span>
        </components.Option>
    );
};

export const CustomMultiValue = (props: MultiValueProps<Option, boolean, GroupBase<Option>>) => {
    const { data } = props;
    return (
        <components.MultiValue {...props}>
            <span className="flex items-center gap-2 text-sm">
                {data.icon && <Image src={data.icon} alt="" width={16} height={16} className="size-4 rounded-full" />}
                {data.label}
            </span>
        </components.MultiValue>
    );
};

export const CustomSingleValue = (props: SingleValueProps<Option, boolean, GroupBase<Option>>) => {
    const { data } = props;
    return (
        <components.SingleValue {...props}>
            <span className="flex items-center gap-2 text-sm">
                {data.icon && <Image src={data.icon} alt="" width={16} height={16} className="size-4 rounded-full" />}
                {data.label}
            </span>
        </components.SingleValue>
    );
};
