import { cva, VariantProps } from 'class-variance-authority';

export const header = cva(
    'flex row-start-1',
    {
        variants: {
            itemsY: {
                center: 'sm:items-center',
                start: 'sm:items-start'
            },
            itemsX: {
                center: 'justify-center',
                start: 'justify-start',
                between: 'justify-between',
                end: 'justify-end'
            },
            space: {
                none: 'gap-0',
                sm: 'gap-5',
                md: 'gap-10',
                lg: 'gap-10 sm:gap-12 lg:gap-15'
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
            }
        },
        defaultVariants: {
            itemsY: 'center',
            itemsX: 'start',
            space: 'md',
            paddingX: 'md',
            paddingY: 'sm',
        }
    }
);

export type HeaderVariantProps = VariantProps<typeof header>;
