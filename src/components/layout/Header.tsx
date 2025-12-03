'use client';

import React from 'react';
import { cn } from '@/components/utils';
import { header } from '@/styles';
import { HeaderProps } from './types.layout';

export const Header = ({
    children,
    className,
    itemsX,
    itemsY,
    paddingX,
    paddingY,
    space
}: HeaderProps) => 
    <header className={cn(header({ itemsX, itemsY, paddingX, paddingY, space}), className)}>
        {children}
    </header>