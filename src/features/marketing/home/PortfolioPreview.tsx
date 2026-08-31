import Image from 'next/image';

export function PortfolioPreview() {
    return (
        <div className="relative mx-auto w-full max-w-[43rem] lg:mr-0">
            <div className="absolute -inset-2 -z-10 rounded-[3rem] bg-accent/12 blur-3xl sm:-inset-8" aria-hidden="true" />
            <div className="absolute -right-3 -top-4 z-10 hidden rotate-2 rounded-2xl border border-line bg-surface-raised px-4 py-3 shadow-xl sm:block">
                <p className="text-xs font-semibold text-ink">Share-ready in minutes</p>
                <p className="mt-0.5 text-[0.68rem] text-ink-muted">One link. Your whole story.</p>
            </div>
            <div className="overflow-hidden rounded-[1.65rem] border border-line bg-surface p-2 shadow-[0_30px_80px_-38px_rgba(20,20,50,0.55)] sm:rounded-[2rem] sm:p-3">
                <div className="mb-2 flex items-center gap-1.5 px-2 pt-1" aria-hidden="true">
                    <span className="size-2 rounded-full bg-red-400/80" />
                    <span className="size-2 rounded-full bg-highlight/80" />
                    <span className="size-2 rounded-full bg-emerald-400/80" />
                    <span className="ml-2 h-2.5 w-24 rounded-full bg-line/70" />
                </div>
                <Image
                    src="/hero-desktop.png"
                    alt="A published portfolio with profile, experience, and project sections"
                    width={1600}
                    height={800}
                    className="h-auto w-full rounded-[1.1rem] border border-line/70"
                    priority
                    sizes="(max-width: 1024px) 100vw, 46vw"
                />
            </div>
            <div className="absolute -bottom-6 left-5 hidden -rotate-2 rounded-2xl border border-line bg-surface-raised px-4 py-3 shadow-xl sm:block">
                <div className="flex items-center gap-2.5">
                    <span className="grid size-8 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent-strong">24</span>
                    <div>
                        <p className="text-xs font-semibold text-ink">Skills, clearly mapped</p>
                        <p className="text-[0.68rem] text-ink-muted">Your strengths at a glance</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
