import React from 'react';
import { PlusIcon } from 'lucide-react'; 
import { ResponsiveIconProps } from './types.ui';

export const ResponsiveIcon = ({ icon: Icon = PlusIcon, className, onClick }: ResponsiveIconProps) => 
    <Icon className={`w-2.5 h-2.5 sm:w-4.5 sm:h-4.5 ${onClick && 'hover:text-light-bg-hover dark:hover:text-dark-bg-hover cursor-pointer'} ${className}`} onClick={onClick} />;