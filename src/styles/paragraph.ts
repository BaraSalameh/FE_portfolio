import { cva, VariantProps } from 'class-variance-authority';

export const paragraph = cva(
    'flex items-center whitespace-pre-line',
    {
        variants: {
            intent: {
                primary:
                    'text-light-primary dark:text-dark-primary',
                secondary:
                    'text-gray-900 dark:text-gray-100',
                success:
                    'text-green-900 dark:text-green-900',
                danger:
                    'text-danger',
            },
            text: {
                justify: 'text-justify',
            },
            position: {
                center: 'justify-center'
            },
            space: {
                none: 'gap-0',
                xs: 'gap-3',
                sm: 'gap-2 sm:gap-3',
                md: 'gap-10',
                lg: 'gap-15'
            },
            clickable: {
                true: 'cursor-pointer hover:text-light-bg-hover dark:hover:text-dark-bg-hover',
                false: null
            }
        },
        defaultVariants: {
            intent: 'primary',
            space: 'sm',
            clickable: false
        },
    }
);

export type ParagraphVariantProps = VariantProps<typeof paragraph>;
