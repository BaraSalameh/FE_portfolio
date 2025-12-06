import { cva, VariantProps } from 'class-variance-authority';

export const link = cva(`hover:text-light-bg-hover dark:hover:text-dark-bg-hover transition-color duration-200 ease-in`);

export type LinkVariantProps = VariantProps<typeof link>;
