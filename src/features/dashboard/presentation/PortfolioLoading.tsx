export function PortfolioLoading() {
    return (
        <div className="min-h-svh bg-canvas px-4 py-4 sm:px-8 sm:py-6" role="status" aria-label="Loading portfolio">
            <div className="mx-auto max-w-[88rem] space-y-5">
                <div className="h-80 animate-pulse rounded-[1.75rem] border border-line bg-surface" />
                <div className="columns-1 gap-4 space-y-4 sm:columns-2 lg:columns-3">
                    {[18, 24, 20, 28, 19, 23].map((height, index) => <div key={index} className="break-inside-avoid animate-pulse rounded-[1.4rem] border border-line bg-surface" style={{ height: `${height}rem` }} />)}
                </div>
            </div>
            <span className="sr-only">Loading portfolio…</span>
        </div>
    );
}
