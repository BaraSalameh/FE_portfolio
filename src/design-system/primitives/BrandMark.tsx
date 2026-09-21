import { paths } from '@/lib/pathHelper';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export function BrandMark() {
    return (
        <Link
            href={paths.root.path()}
            className="group inline-flex items-center gap-2.5 rounded-full text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
            aria-label="Folio home"
        >
            <span className="grid size-9 place-items-center rounded-xl bg-brand-logo text-brand-paper shadow-sm transition-transform group-hover:-rotate-3">
                <Sparkles className="size-[1.1rem]" aria-hidden="true" />
            </span>
            <span className="text-[0.95rem] font-bold tracking-[-0.045em] sm:text-base">folio.</span>
        </Link>
    );
}
