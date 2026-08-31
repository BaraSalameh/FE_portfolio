import { cn } from '@/lib/ui/cn';
import { cva, type VariantProps } from 'class-variance-authority';
import Link, { type LinkProps } from 'next/link';
import type { AnchorHTMLAttributes, ReactNode } from 'react';

const actionLink = cva(
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold tracking-[-0.01em] transition-[transform,background-color,border-color,color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas active:translate-y-px',
    {
        variants: {
            intent: {
                primary: 'border border-accent bg-accent text-white shadow-[0_10px_30px_-12px_var(--ds-accent)] hover:-translate-y-0.5 hover:bg-accent-strong',
                secondary: 'border border-line bg-surface text-ink shadow-sm hover:-translate-y-0.5 hover:border-accent/35 hover:bg-surface-raised',
                quiet: 'border border-transparent text-ink-muted hover:bg-accent-soft hover:text-ink',
            },
            size: {
                sm: 'min-h-10 px-4 text-sm',
                md: 'min-h-11 px-5 text-sm',
                lg: 'min-h-12 px-6 text-base',
            },
        },
        defaultVariants: {
            intent: 'primary',
            size: 'md',
        },
    },
);

type ActionLinkProps = LinkProps
    & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>
    & VariantProps<typeof actionLink>
    & { children: ReactNode };

export function ActionLink({ className, intent, size, children, ...props }: ActionLinkProps) {
    return (
        <Link className={cn(actionLink({ intent, size }), className)} {...props}>
            {children}
        </Link>
    );
}
