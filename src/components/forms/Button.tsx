import React from 'react';
import { button } from '@/styles';
import { cn } from '@/components/utils';
import { ButtonProps } from './types.forms';
import Link from 'next/link';

export const Button = ({
    children,
    size,
    rounded,
    className,
    type = 'button',
    onClick,
    onClose,
    url,
    disabled
}: ButtonProps) => {

    const handleClick = () => {
        onClick?.();
        onClose?.();
    };
    
    const buttonContent = (
        <button
            type={type}
            className={cn(button({ size, rounded }), className)}
            onClick={handleClick}
            disabled={disabled}
        >
            {children}
        </button>
    );

    if (url) {
        return (
            <Link href={url} className={cn(button({ size }), className)}>
                {children}
            </Link>
        );
    }

    return buttonContent;
};
