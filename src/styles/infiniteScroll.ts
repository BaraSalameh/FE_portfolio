import { cva, VariantProps } from 'class-variance-authority';

export const infiniteScroll = cva(
    'overflow-y-auto scrollbar-hide',
    {
        variants: {
            size: {
                xs: 'max-h-40',
                sm: 'max-h-50',
                md: 'max-h-60',
                lg: 'max-h-70',
                xl: 'max-h-80',
                none: null,
                full: 'max-h-full'
            },
            rounded: {
                xs: 'rounded-xs',
                sm: 'rounded-sm',
                md: 'rounded-md',
                lg: 'rounded-lg',
                xl: 'rounded-2xl',
                full: 'rounded-full',
                none: null
            },
            position: {
                relative: 'relative',
                absolute: 'absolute'
            },
            border: {
                true: 'border border-light-border-hover dark:border-dark-border-hover',
                false: null
            },
            background: {
                true: 'bg-light-component dark:bg-dark-component',
                false: null
            },
            space: {
                xs: '[&_.infinite-scroll-component]:space-y-1',
                sm: '[&_.infinite-scroll-component]:space-y-2',
                md: '[&_.infinite-scroll-component]:space-y-3',
                lg: '[&_.infinite-scroll-component]:space-y-4',
                xl: '[&_.infinite-scroll-component]:space-y-5',
                full: null,
                none: null
            }
        },
        defaultVariants: {
            size: 'md',
            rounded: 'xl',
            position: 'relative',
            border: false,
            background: false,
            space: 'none',
        },
    }
);

export type InfiniteScrollVariantProps = VariantProps<typeof infiniteScroll>;