import React from 'react';
import { PlusIcon } from 'lucide-react'; 
import { ResponsiveIconProps } from './types.ui';
import clsx from 'clsx';

export const ResponsiveIcon = ({
    icon: Icon = PlusIcon,
    className,
    onClick
}: ResponsiveIconProps) => 
    <Icon
        className={clsx(
            'h-6 w-6',
            {'hover:text-light-bg-hover dark:hover:text-dark-bg-hover cursor-pointer': !!onClick},
            className
        )}
        onClick={onClick}
    />