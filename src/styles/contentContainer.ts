import { cva, VariantProps } from 'class-variance-authority';

export const contentContainer = cva(
    'relative w-full min-w-50',
    {
        variants: {
            rounded: {
                xs: 'rounded-xs',
                sm: 'rounded-sm',
                md: 'rounded-md',
                lg: 'rounded-lg',
                xl: 'rounded-2xl',
                full: 'rounded-full',
                none: null
            },
            border: {
                xs: 'border-1',
                sm: 'border-2',
                md: 'border-3',
                lg: 'border-4',
                xl: 'border-5',
                full: 'border-6',
                none: null
            },
            paddingX: {
                none: 'px-0',
                xs: 'px-3 sm:px-4 md:px-5 lg:px-6',
                sm: 'px-5 sm:px-6 md:px-7 lg:px-8',
                md: 'px-10 sm:px-11 md:px-12 lg:px-13',
                lg: 'px-15 sm:px-16 md:px-17 lg:px-18',
            },
            paddingY: {
                none: 'py-0',
                xs: 'py-3',
                sm: 'py-5',
                md: 'py-10',
                lg: 'py-15',
            },
            space: {
                xs: 'space-y-1',
                sm: 'space-y-2',
                md: 'space-y-3',
                lg: 'space-y-4',
                xl: 'space-y-5',
                full: 'space-y-6',
                none: null
            }
        },
        defaultVariants: {
            rounded: 'md',
            border: 'xs',
            paddingX: 'xs',
            paddingY: 'sm',
            space: 'sm'
        },
    }
);

export const contentContainerLabel = cva(
    'absolute px-2 -top-2 left-3 bg-light-component dark:bg-dark-component'
);

export type ContentContainerVariantProps = VariantProps<typeof contentContainer>;
export type ContentContainerLabelVariantProps = VariantProps<typeof contentContainerLabel>;