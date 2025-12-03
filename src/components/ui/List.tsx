'use client';

import React from 'react';
import { cn } from '@/components/utils';
import { list } from '@/styles';
import { ListProps } from './types.ui';

export const List = ({
    children,
    intent,
    as,
    className,
    
}: ListProps) => {
    return (
        <ol className={cn(list({ intent, as }), className)}>
            {children}
        </ol>
    );
};
