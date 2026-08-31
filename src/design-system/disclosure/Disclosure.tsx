'use client';

import { cn } from '@/lib/ui/cn';
import { ChevronDown } from 'lucide-react';
import type { ReactNode } from 'react';
import { useId, useState } from 'react';

export function Disclosure({ title, children, className }: { title: string; children: ReactNode; className?: string; space?: string }) {
    const [open, setOpen] = useState(false);
    const contentId = useId();
    return (
        <section className={cn('overflow-hidden rounded-xl border border-line bg-surface', className)}>
            <button type="button" onClick={() => setOpen((value) => !value)} className="flex min-h-12 w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-sm font-bold text-ink transition hover:bg-canvas-subtle" aria-expanded={open} aria-controls={contentId}>
                <span>{title}</span><ChevronDown className={cn('size-4 shrink-0 text-ink-muted transition-transform', open && 'rotate-180')} aria-hidden="true" />
            </button>
            {open && <div id={contentId} className="space-y-2 border-t border-line p-2.5">{children}</div>}
        </section>
    );
}
