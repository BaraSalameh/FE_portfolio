import React from 'react';
import { button } from '@/styles';
import { cn } from '@/components/utils';
import { ButtonProps } from './types.forms';
import Link from 'next/link';
import ButtonClient from '../ui/ButtonClient';

export const Button = (props: ButtonProps) => {

    const { url, children, ...rest } = props;

    if (!!url) {
        const { size, className } = rest;
        return (
            <Link href={url} className={cn(button({ size }), className)}>
                {children}
            </Link>
        );
    } else {
        return <ButtonClient {...rest}>{children}</ButtonClient>
    }
};
