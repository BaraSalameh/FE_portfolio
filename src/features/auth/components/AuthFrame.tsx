import { ActionLink } from '@/design-system';
import { paths } from '@/lib/pathHelper';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';

type AuthFrameProps = {
    children: ReactNode;
    alternateHref: string;
    alternateLabel: string;
    prompt: string;
};

export function AuthFrame({ children, alternateHref, alternateLabel, prompt }: AuthFrameProps) {
    return (
        <div className="grid flex-1 items-stretch lg:grid-cols-[minmax(0,1fr)_minmax(26rem,0.78fr)]">
            <main className="flex items-center justify-center px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
                <div className="w-full max-w-[31rem]">
                    {children}
                    <div className="mt-7 flex flex-col items-center justify-between gap-3 border-t border-line pt-5 text-sm text-ink-muted sm:flex-row">
                        <ActionLink href={paths.root.path()} intent="quiet" size="sm" className="px-2">
                            <ArrowLeft className="size-4" aria-hidden="true" /> Home
                        </ActionLink>
                        <p>
                            {prompt}{' '}
                            <Link href={alternateHref} className="font-bold text-accent-strong underline-offset-4 hover:underline">
                                {alternateLabel}
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
            <aside className="relative hidden overflow-hidden border-l border-line bg-canvas-subtle p-10 lg:flex lg:flex-col lg:justify-end" aria-label="Portfolio benefits">
                <div className="absolute left-1/2 top-16 size-[28rem] -translate-x-1/2 rounded-full border border-accent/15" aria-hidden="true" />
                <div className="absolute left-1/2 top-24 size-[22rem] -translate-x-1/2 rounded-full border border-accent/20" aria-hidden="true" />
                <div className="absolute left-1/2 top-32 size-64 -translate-x-1/2 rounded-full bg-accent-soft shadow-[0_0_80px_20px_var(--ds-accent-soft)]" aria-hidden="true" />
                <div className="relative mx-auto mb-20 w-full max-w-sm rounded-[1.75rem] border border-line bg-surface-raised p-6 shadow-2xl shadow-black/10 -rotate-2">
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-accent">Your portfolio</p>
                    <div className="mt-5 flex items-center gap-3">
                        <span className="size-12 rounded-full bg-accent-soft" />
                        <div className="space-y-2">
                            <span className="block h-2.5 w-32 rounded-full bg-ink/80" />
                            <span className="block h-2 w-20 rounded-full bg-line" />
                        </div>
                    </div>
                    <div className="mt-7 grid grid-cols-3 gap-2">
                        {[65, 86, 52].map((height) => <span key={height} className="rounded-xl bg-canvas-subtle" style={{ height }} />)}
                    </div>
                </div>
                <div className="relative max-w-lg">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent">One account, one clear story</p>
                    <h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.045em]">Keep your professional presence ready for what comes next.</h2>
                    <ul className="mt-6 space-y-3 text-sm text-ink-muted">
                        {['Update your experience whenever it changes', 'Control how your work is presented', 'Share a single, memorable portfolio link'].map((item) => (
                            <li key={item} className="flex items-center gap-2.5">
                                <CheckCircle2 className="size-4 text-accent" aria-hidden="true" /> {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        </div>
    );
}
