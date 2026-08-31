import type { TooltipProps } from 'recharts';

export const chartTooltip = ({ active, payload, label }: TooltipProps<number | string, string>) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl border border-line bg-surface-elevated p-3 shadow-lg">
            {payload.map((item, index) => (
                <p className="text-sm text-ink-muted" key={`${item.name ?? 'value'}-${index}`}>
                    {label ?? item.name}: {item.value}
                </p>
            ))}
        </div>
    );
};
