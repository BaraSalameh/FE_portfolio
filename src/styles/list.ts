import { cva, VariantProps } from 'class-variance-authority';

export const list = cva(
    'list-inside  flex flex-col gap-2 font-[family-name:var(--font-geist-mono)]',
    {
        variants: {
            intent: {
                primary:
                    'text-green-900 dark:text-green-900',
                secondary:
                    'text-gray-900 dark:text-gray-100',
                danger:
                    'text-red-700 dark:text-red-400',
                standard:
                    '',
            },
            size: {
                xs: 'text-xs',
                sm: 'text-sm/6',
                md: 'text-md/6',
                lg: 'text-lg/6'
            },
            as: {
                ol: 'list-decimal list-decimal',
                ul: 'list-decimal list-disc',
                none: null
            }
        },
        defaultVariants: {
            intent: 'standard',
            size: 'md',
            as: 'ol'
        },
    }
);

export type ListVariantProps = VariantProps<typeof list>;
