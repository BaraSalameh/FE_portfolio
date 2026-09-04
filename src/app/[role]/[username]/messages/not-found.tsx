import { ActionLink } from '@/design-system';

export default function MessagesNotFound() {
    return <main className="grid min-h-svh place-items-center bg-canvas px-5 text-ink"><section className="w-full max-w-lg rounded-[1.5rem] border border-line bg-surface p-7 text-center shadow-xl shadow-black/5"><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">404</p><h1 className="mt-2 text-2xl font-bold tracking-[-0.04em]">Messages not found</h1><p className="mt-3 text-sm leading-6 text-ink-muted">This inbox is available only to the portfolio owner.</p><ActionLink href="/" className="mt-6">Return home</ActionLink></section></main>;
}
