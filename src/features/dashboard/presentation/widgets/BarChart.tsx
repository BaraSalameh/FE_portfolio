"use client";

import { ChartTooltip } from '@/lib/ui/chartTooltip';
import { generateColorMap } from "@/lib/utils";
import { Cell, Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartWidgetProps } from '@/features/dashboard/types.presentation';

export const BarChartWidget = ({
    data,
    colorMap,
    unit,
    measure,
    metricLabel,
    total
}: ChartWidgetProps) => {
    const internalColorMap = colorMap ?? generateColorMap(data);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 56, bottom: 4, left: 8 }} accessibilityLayer>
                <CartesianGrid stroke="var(--chart-grid)" horizontal={false} />
                <XAxis type="number" domain={[0, unit === 'percent' ? 100 : 'auto']} tick={{ fill: 'var(--chart-axis)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={96} tick={{ fill: 'var(--chart-axis)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip unit={unit} measure={measure} metricLabel={metricLabel} total={total} />} cursor={{ fill: 'var(--ds-accent-soft)', opacity: 0.45 }} />
                <Bar
                    dataKey="value"
                    radius={[0, 8, 8, 0]}
                    fillOpacity={1}
                    isAnimationActive={false}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-bar-${index}`} fill={internalColorMap[entry.name]} />
                    ))}
                    <LabelList dataKey="value" position="right" fill="var(--chart-axis)" fontSize={11} formatter={(value: unknown) => unit === 'percent' ? `${value}%` : String(value)} />
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};
