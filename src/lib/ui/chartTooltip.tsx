import type { TooltipProps } from 'recharts';
import type { ChartMeasure, ChartConfig } from '@/features/dashboard/types.presentation';

const formatValue = (value: number | string | undefined, unit?: string) => {
    if (value === undefined) return '';
    if (unit === 'percent') return `${value}%`;
    if (unit === 'months') return `${value} ${Number(value) === 1 ? 'month' : 'months'}`;
    const formatted = new Intl.NumberFormat().format(Number(value));
    if (unit === 'items') return `${formatted} ${Number(value) === 1 ? 'item' : 'items'}`;
    return formatted;
};

type ChartTooltipProps = TooltipProps<number | string, string> & {
    unit?: ChartConfig['unit'];
    measure?: ChartMeasure;
    metricLabel?: string;
    total?: number;
};

const getContext = ({ value, total, measure, metricLabel }: {
    value: number;
    total?: number;
    measure?: ChartMeasure;
    metricLabel?: string;
}) => {
    if (measure === 'proficiency') return 'Self-reported proficiency on a 0–100 scale.';
    if (measure !== 'count' && measure !== 'duration') return null;
    if (!total || total <= 0 || !Number.isFinite(value)) return null;

    const share = Math.round((value / total) * 100);
    const subject = measure === 'duration' ? 'recorded duration' : (metricLabel ?? 'items').toLowerCase();
    return `Accounts for ${share}% of the ${subject} shown in this chart.`;
};

export const ChartTooltip = ({ unit, measure, metricLabel = 'Value', total, ...props }: ChartTooltipProps) => {
    const { active, payload, label } = props;
    if (!active || !payload?.length) return null;

    const item = payload[0];
    const value = item.value;
    const numericValue = Number(value);
    const payloadName = item.payload && typeof item.payload === 'object' && 'name' in item.payload
        ? item.payload.name
        : undefined;
    const category = String(payloadName ?? label ?? item.name ?? 'Category');
    const context = getContext({ value: numericValue, total, measure, metricLabel });

    return (
        <div
            data-testid="chart-tooltip"
            className="min-w-44 max-w-64 rounded-xl border border-line bg-surface-raised p-3.5 text-ink opacity-100 shadow-xl shadow-black/15 dark:shadow-black/40"
        >
            <p className="text-sm font-bold tracking-[-0.01em]">{category}</p>
            <p className="mt-1.5 text-xs font-medium text-ink-muted">
                {metricLabel}: <span className="font-bold text-ink">{formatValue(value, unit)}</span>
            </p>
            {context ? <p className="mt-2 border-t border-line pt-2 text-xs leading-5 text-ink-muted">{context}</p> : null}
        </div>
    );
};
