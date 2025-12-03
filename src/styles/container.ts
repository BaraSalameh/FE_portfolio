import { cva, VariantProps } from 'class-variance-authority';

export const container = cva(
    'grid-rows-[1fr_1fr_1fr] font-[family-name:var(--font-geist-sans)] w-full'
);

export type ContainerVariantProps = VariantProps<typeof container>;
