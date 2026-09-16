import type { TooltipProps } from 'recharts';

const formatValue = (value: number | string | undefined, unit?: string) => {
    if (value === undefined) return '';
    if (unit === 'percent') return `${value}%`;
    if (unit === 'months') return `${value} ${Number(value) === 1 ? 'month' : 'months'}`;
    return new Intl.NumberFormat().format(Number(value));
};

export const ChartTooltip = ({ unit, ...props }: TooltipProps<number | string, string> & { unit?: string }) => {
    const { active, payload, label } = props;
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl border border-line bg-surface-elevated p-3 shadow-lg">
            {payload.map((item, index) => (
                <p className="text-sm text-ink-muted" key={`${item.name ?? 'value'}-${index}`}>
                    {label ?? item.name}: <span className="font-semibold text-ink">{formatValue(item.value, unit)}</span>
                </p>
            ))}
        </div>
    );
};
