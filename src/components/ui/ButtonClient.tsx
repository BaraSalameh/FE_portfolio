"use client";

import { cn } from "@/components/utils";
import { button } from "@/styles";
import { ButtonProps } from "../forms/types.forms";

export default function ButtonClient({
    type,
    children,
    size,
    rounded,
    className,
    onClick,
    onClose,
    disabled,
    testId
}: ButtonProps) {
    const handleClick = () => {
        onClick?.();
        onClose?.();
    };

    return (
        <button
            type={type}
            className={cn(button({ size, rounded }), className)}
            onClick={handleClick}
            disabled={disabled}
            data-testid={testId}
        >
            {children}
        </button>
    );
}
