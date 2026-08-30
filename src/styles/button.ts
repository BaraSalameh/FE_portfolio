import { cva, VariantProps } from 'class-variance-authority';

export const button = cva(
    `
    gap-2 flex items-center justify-center border border-light-primary dark:border-dark-primary
    hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover hover:border-transparent cursor-pointer
    transition-color duration-200 ease-in
    `,
    {
        variants: {
            size: {
                xs: 'px-2 py-1',
                sm: 'px-3 py-1',
                md: 'px-4 py-2',
                lg: 'px-6 py-3'
            },
            rounded: {
                none: 'rounded-none',
                sm: 'rounded-sm',
                md: 'rounded-md',
                full: 'rounded-full',
            },
        },
        defaultVariants: {
            size: 'md',
            rounded: 'md'
        },
    }
);

export type ButtonVariantProps = VariantProps<typeof button>;
