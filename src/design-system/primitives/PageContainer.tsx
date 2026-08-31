import { cn } from '@/lib/ui/cn';
import type { ComponentPropsWithoutRef, ElementType } from 'react';

type PageContainerProps<T extends ElementType = 'div'> = {
    as?: T;
} & Omit<ComponentPropsWithoutRef<T>, 'as'>;

export function PageContainer<T extends ElementType = 'div'>({
    as,
    className,
    ...props
}: PageContainerProps<T>) {
    const Component = as ?? 'div';

    return (
        <Component
            className={cn('mx-auto w-full max-w-[88rem] px-5 sm:px-8 lg:px-12', className)}
            {...props}
        />
    );
}
