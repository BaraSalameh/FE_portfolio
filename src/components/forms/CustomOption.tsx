"use client";

/* Option icons may come from portfolio-api at runtime, so a native image is intentional. */
/* eslint-disable @next/next/no-img-element */
import { components, GroupBase, MultiValueProps, OptionProps, SingleValueProps } from 'react-select';
import { Paragraph } from '../ui/Paragraph';
import { Option } from '@/features/types.features';

export const CustomOption = (props: OptionProps<Option, boolean, GroupBase<Option>>) => {
    const { data } = props;
    return (
        <components.Option {...props}>
            <Paragraph>
                {data.icon && <img src={data.icon} alt="" className="h-4 w-4 rounded-full" />}
                {data.label}
            </Paragraph>
        </components.Option>
    );
};

export const CustomMultiValue = (props: MultiValueProps<Option, boolean, GroupBase<Option>>) => {
    const { data } = props;
    return (
        <components.MultiValue {...props}>
            <Paragraph>
                {data.icon && <img src={data.icon} alt="" className="h-4 w-4 rounded-full" />}
                {data.label}
            </Paragraph>
        </components.MultiValue>
    );
};

export const CustomSingleValue = (props: SingleValueProps<Option, boolean, GroupBase<Option>>) => {
    const { data } = props;
    return (
        <components.SingleValue {...props}>
            <Paragraph>
                {data.icon && <img src={data.icon} alt="" className="h-4 w-4 rounded-full" />}
                {data.label}
            </Paragraph>
        </components.SingleValue>
    );
};
