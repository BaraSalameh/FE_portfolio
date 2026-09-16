import type { ChartEntry, ChartConfig } from '@/features/dashboard/types.presentation';
import { useId, type ReactNode } from 'react';

const formatValue = (value: number, unit?: ChartConfig['unit']) => {
    if (unit === 'percent') return `${value}%`;
    if (unit === 'months') return `${value} ${value === 1 ? 'month' : 'months'}`;
    return new Intl.NumberFormat().format(value);
};

export const ChartFrame = ({ title, description, data, unit, children }: { title: string; description?: string; data: ChartEntry[]; unit?: ChartConfig['unit']; children: ReactNode }) => {
    const titleId = useId();
    return <figure className="min-w-0 rounded-2xl border border-line bg-canvas-subtle/45 p-4" aria-labelledby={titleId}>
        <figcaption className="mb-3">
            <h3 id={titleId} className="text-sm font-bold text-ink">{title}</h3>
            <p className="mt-1 text-xs leading-5 text-ink-muted">{description ?? `Based on ${data.length} ${data.length === 1 ? 'category' : 'categories'}.`}</p>
        </figcaption>
        <div className="h-[clamp(17rem,40vw,22rem)] min-w-0" aria-hidden="true">{children}</div>
        <details className="mt-3 text-sm">
            <summary className="font-semibold text-accent-strong">View chart data</summary>
            <div className="mt-2 overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                    <thead><tr className="border-b border-line"><th className="py-2 pr-4">Category</th><th className="py-2">Value</th></tr></thead>
                    <tbody>{data.map((item) => <tr className="border-b border-line/60" key={item.name}><th className="py-2 pr-4 font-medium">{item.name}</th><td className="py-2 text-ink-muted">{formatValue(item.value, unit)}</td></tr>)}</tbody>
                </table>
            </div>
        </details>
    </figure>;
};
