'use client';

export default function MessagesError({ reset }: { reset: () => void }) {
    return <main className="grid min-h-svh place-items-center bg-canvas px-5 text-ink"><section className="w-full max-w-lg rounded-[1.5rem] border border-line bg-surface p-7 text-center shadow-xl shadow-black/5"><h1 className="text-2xl font-bold tracking-[-0.04em]">Messages unavailable</h1><p className="mt-3 text-sm leading-6 text-ink-muted">We could not load your messages. Please try again.</p><button type="button" onClick={reset} className="mt-6 min-h-11 rounded-full bg-accent px-6 text-sm font-bold text-white hover:bg-accent-strong">Try again</button></section></main>;
}
