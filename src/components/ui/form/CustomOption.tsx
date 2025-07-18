"use client";

import { components } from 'react-select';
import { Paragraph } from '../Paragraph';

export const CustomOption = (props: any) => {
    const { data } = props;
    return (
        <components.Option {...props}>
            <Paragraph>
                {data.icon && <img src={data.icon} className="h-4 w-4 rounded-full" />}
                {data.label}
            </Paragraph>
        </components.Option>
    );
};

export const CustomMultiValue = (props: any) => {
    const { data } = props;
    return (
        <components.MultiValue {...props}>
            <Paragraph>
                {data.icon && <img src={data.icon} className="h-4 w-4 rounded-full" />}
                {data.label}
            </Paragraph>
        </components.MultiValue>
    );
};

export const CustomSingleValue = (props: any) => {
    const { data } = props;
    return (
        <components.SingleValue {...props}>
            <Paragraph>
                {data.icon && <img src={data.icon} className="h-4 w-4 rounded-full" />}
                {data.label}
            </Paragraph>
        </components.SingleValue>
    );
};