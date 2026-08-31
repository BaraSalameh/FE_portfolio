'use client';
 
import { ActionLink } from '@/design-system';
import { paths } from '@/lib/pathHelper';
import { RefreshCcw } from 'lucide-react';
import { useEffect } from 'react';
 
const Error = ({ error, reset }: {
    error: Error & { digest?: string };
    reset: () => void;
}) => {

    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="grid min-h-svh place-items-center bg-canvas px-5 text-ink">
            <section className="w-full max-w-lg rounded-[1.5rem] border border-line bg-surface p-7 text-center shadow-xl shadow-black/5">
                <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-danger/10 text-danger"><RefreshCcw className="size-5" aria-hidden="true" /></span>
                <h1 className="mt-5 text-2xl font-bold tracking-[-0.04em]">Search unavailable</h1>
                <p className="mt-2 text-sm leading-6 text-ink-muted">{error.message}</p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <ActionLink href={paths.root.path()} intent="secondary" className="flex-1">Go home</ActionLink>
                    <button onClick={reset} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-bold text-white transition hover:bg-accent-strong"><RefreshCcw className="size-4" aria-hidden="true" /> Try again</button>
                </div>
            </section>
        </main>
    );
}

export default Error;
