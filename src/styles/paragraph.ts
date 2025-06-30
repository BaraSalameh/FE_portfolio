import { cva, VariantProps } from 'class-variance-authority';

export const paragraph = cva(
    'flex items-center whitespace-pre-line font-[family-name:var(--font-geist-mono)]',
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
            size: {
                xs: 'text-xs',
                sm: 'text-xs sm:text-xs md: text-sm',
                md: 'text-xs sm:text-md md:text-md',
                lg: 'text-sm sm:text-md md:text-lg',
                xl: 'text-md sm:text-lg md:text-xl'
            },
            text: {
                standard: null,
                justify: 'text-justify',
            },
            position: {
                start: null,
                center: 'justify-center'
            },
            space: {
                none: 'gap-0',
                xs: 'gap-3',
                sm: 'gap-2 sm:gap-3',
                md: 'gap-10',
                lg: 'gap-15'
            },
        },
        defaultVariants: {
            intent: 'primary',
            size: 'md',
            text: 'standard',
            position: 'start',
            space: 'sm'
        },
    }
);

export type ParagraphVariantProps = VariantProps<typeof paragraph>;
