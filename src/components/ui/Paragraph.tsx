'use client';

import React from 'react';
import { cn } from '@/components/utils';
import { paragraph } from '@/styles';
import { ParagraphProps } from './types.ui';

export const Paragraph = ({
    children,
    intent,
    text,
    position,
    space,
    className,
    onClick
}: ParagraphProps) => {
    return (
        <p className={cn(paragraph({ intent, text, position, space, clickable: onClick ? true : false }), className)} onClick={onClick}>
            {children}
        </p>
    );

};
