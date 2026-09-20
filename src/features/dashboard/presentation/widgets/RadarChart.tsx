"use client";

import { ChartTooltip } from '@/lib/ui/chartTooltip';
import { ResponsiveContainer, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { ChartWidgetProps } from '@/features/dashboard/types.presentation';

export const RadarChartWidget = ({
    data,
    unit,
    measure,
    metricLabel,
    total
}: ChartWidgetProps) => {
    if (data.length < 3) {
        return (
            <ul className="flex h-full flex-col justify-center gap-4 px-2 sm:px-8">
                {data.map((item) => <li key={item.name}><div className="flex items-center justify-between gap-3 text-sm"><span className="font-semibold text-ink">{item.name}</span><span className="text-ink-muted">{unit === 'percent' ? `${item.value}%` : item.value}</span></div><div className="mt-2 h-3 overflow-hidden rounded-full bg-line/60"><span className="block h-full rounded-full bg-accent" style={{ width: `${Math.max(0, Math.min(100, item.value))}%` }} /></div></li>)}
            </ul>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="68%" data={data} accessibilityLayer>
                <PolarGrid stroke="var(--chart-grid)" />
                <PolarAngleAxis dataKey="name" tick={{ fill: 'var(--chart-axis)', fontSize: 11 }} />
                <Radar
                    dataKey="value"
                    stroke="var(--chart-1)"
                    fill="var(--chart-1)"
                    fillOpacity={0.35}
                    isAnimationActive={false}
                />
                <Tooltip content={<ChartTooltip unit={unit} measure={measure} metricLabel={metricLabel} total={total} />} />
            </RadarChart>
      </ResponsiveContainer>
    );
};
