'use client';

import { cn } from '@/lib/ui/cn';
import { generatePagination } from '@/lib/utilities';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

const itemClass = 'inline-flex size-10 items-center justify-center rounded-xl border border-line bg-surface text-sm font-semibold text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas';

export function SearchPagination({ totalPages }: { totalPages: number }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentPage = Math.min(Math.max(Number(searchParams.get('page')) || 1, 1), Math.max(totalPages, 1));
    if (totalPages <= 1) return null;

    const hrefFor = (page: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', String(page));
        return `${pathname}?${params.toString()}`;
    };

    return (
        <nav aria-label="Portfolio results pages" className="mt-8 flex items-center justify-center gap-2">
            <PageArrow href={hrefFor(currentPage - 1)} disabled={currentPage === 1} direction="previous" />
            <ol className="flex items-center gap-1">
                {generatePagination(currentPage, totalPages).map((page, index) => (
                    <li key={`${page}-${index}`}>
                        {page === '...' ? (
                            <span className="inline-flex size-10 items-center justify-center text-ink-muted" aria-hidden="true">…</span>
                        ) : page === currentPage ? (
                            <span className={cn(itemClass, 'border-accent bg-accent text-white')} aria-current="page" aria-label={`Page ${page}, current page`}>{page}</span>
                        ) : (
                            <Link className={itemClass} href={hrefFor(Number(page))} aria-label={`Go to page ${page}`}>{page}</Link>
                        )}
                    </li>
                ))}
            </ol>
            <PageArrow href={hrefFor(currentPage + 1)} disabled={currentPage === totalPages} direction="next" />
        </nav>
    );
}

function PageArrow({ href, disabled, direction }: { href: string; disabled: boolean; direction: 'previous' | 'next' }) {
    const Icon = direction === 'previous' ? ArrowLeft : ArrowRight;
    const label = `Go to ${direction} page`;
    return disabled ? (
        <span className={cn(itemClass, 'cursor-not-allowed opacity-35')} aria-disabled="true" aria-label={label}><Icon className="size-4" aria-hidden="true" /></span>
    ) : (
        <Link className={itemClass} href={href} aria-label={label}><Icon className="size-4" aria-hidden="true" /></Link>
    );
}
