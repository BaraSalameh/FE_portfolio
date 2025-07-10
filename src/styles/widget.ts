import { cva, VariantProps } from 'class-variance-authority';

export const widgetCard = cva(
    'relative bg-light-component dark:bg-dark-component rounded-2xl',
    {
        variants: {
            scroll: {
                true: 'overflow-auto scrollbar-hide',
                false: null
            },
            paddingX: {
                xs: 'px-2',
                sm: 'px-4',
                md: 'px-6',
                lg: 'px-8',
                xl: 'px-10',
                none: null
            },
            paddingY: {
                xs: 'py-2',
                sm: 'py-4',
                md: 'py-6',
                lg: 'py-8',
                xl: 'py-10',
                none: null
            },
            minHeight: {
                xs: 'min-h-[10vh]',
                sm: 'min-h-[25vh]',
                md: 'min-h-[40vh]',
                lg: 'min-h-[55vh]',
                xl: 'min-h-[70vh]',
                none: null
            },
            maxHeight: {
                xs: 'max-h-[25vh]',
                sm: 'max-h-[40vh]',
                md: 'max-h-[55vh]',
                lg: 'max-h-[70vh]',
                xl: 'max-h-[85vh]',
                none: null
            }
        },
        compoundVariants: [
            { scroll: true, className: 'max-h-[70vh]' },
        ],
        defaultVariants: {
            scroll: false,
            paddingX: 'sm',
            paddingY: 'sm',
            minHeight: 'none',
            maxHeight: 'none'
        }
    }
    
);

export const widgetList = cva(
    'bg-light-sub-component dark:bg-dark-sub-component space-y-3 rounded-2xl px-4 py-3', 
    {
        variants: {
            clickable : {
                true: 'cursor-pointer',
                false: null
            },
            opacity: {
                true: 'opacity-40',
                false: null
            }
        },
        defaultVariants: {
            clickable: true
        }
    }
);

export type WidgetCardVariantProps = VariantProps<typeof widgetCard>;
export type WidgetListVariantProps = VariantProps<typeof widgetList>;
