import type { KpiEntry } from '@/features/dashboard/types.presentation';

export const KpiGrid = ({ items }: { items: KpiEntry[] }) => (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-[repeat(auto-fit,minmax(9rem,1fr))]">
        {items.map((item) => (
            <div key={item.label} className="rounded-2xl border border-line bg-canvas-subtle/55 p-4">
                <dt className="text-xs font-semibold text-ink-muted">{item.label}</dt>
                <dd className="mt-1 text-2xl font-bold tracking-[-0.04em] text-ink">{item.value}<span className="ml-1 text-xs font-semibold tracking-normal text-ink-muted">{item.unit}</span></dd>
            </div>
        ))}
    </dl>
);
