import React from 'react';
import { anchor } from '@/styles';
import { cn } from '@/components/utils';
import { AnchorProps } from './types.forms';
import Link from 'next/link';

export const Anchor = ({
    url,
    className,
    size = 'xs',
    children
}: AnchorProps) => {
    
    return (
        <Link href={url} className={cn(anchor({ size }), className)}>
            {children}
        </Link>
    );
};
