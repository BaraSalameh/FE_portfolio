import { cva, VariantProps } from 'class-variance-authority';

export const widgetCard = cva(
    'relative bg-light-component dark:bg-dark-component p-4 rounded-2xl',
    {
        variants: {
            scroll: {
                true: 'max-h-[70vh] overflow-auto scrollbar-hide',
                false: null
            }
        },
        defaultVariants: {
            scroll: false
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
