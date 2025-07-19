'use client';

import React from 'react';
import { cn } from '@/components/utils';
import { blurBackground } from '@/styles';
import { BlurBackgroundProps } from './types.shared';

export const BlurBackground = ({
    children,
    fullScreen,
    intent,
    className,
    onClick,
}: BlurBackgroundProps) => {
    return (
        <div className={cn(blurBackground({ intent, fullScreen, clickable: onClick ? true : false }), className)} onClick={onClick}>
            {children}
        </div>
    );
};
