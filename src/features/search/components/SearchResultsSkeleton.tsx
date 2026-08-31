export function SearchResultsSkeleton() {
    return (
        <div aria-label="Loading portfolios" role="status">
            <div className="mb-5 h-5 w-32 animate-pulse rounded-full bg-line/70" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }, (_, index) => (
                    <div key={index} className="min-h-48 animate-pulse rounded-[1.4rem] border border-line bg-surface p-5">
                        <div className="size-14 rounded-2xl bg-line/70" />
                        <div className="mt-7 h-4 w-2/3 rounded-full bg-line/70" />
                        <div className="mt-3 h-3 w-1/2 rounded-full bg-line/50" />
                        <div className="mt-7 h-9 rounded-full bg-line/40" />
                    </div>
                ))}
            </div>
            <span className="sr-only">Loading portfolio results…</span>
        </div>
    );
}
