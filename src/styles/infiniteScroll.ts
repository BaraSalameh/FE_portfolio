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
                true: 'border border-zinc-700',
                false: null
            },
            background: {
                true: 'bg-zinc-900',
                false: null
            },
            space: {
                xs: 'space-y-1',
                sm: 'space-y-2',
                md: 'space-y-3',
                lg: 'space-y-4',
                xl: 'space-y-5',
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