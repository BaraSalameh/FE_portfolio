import React from 'react';
import { PlusIcon } from 'lucide-react'; 
import { ResponsiveIconProps } from './types';

export const ResponsiveIcon = ({ icon: Icon = PlusIcon, className, onClick }: ResponsiveIconProps) => 
    <Icon className={`w-2.5 h-2.5 sm:w-4.5 sm:h-4.5 ${className}`} onClick={onClick} />;