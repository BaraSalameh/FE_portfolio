"use client";

import { ChartTooltip } from '@/lib/ui/chartTooltip';
import { generateColorMap } from "@/lib/utils";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartWidgetProps } from '@/features/dashboard/types.presentation';

export const PieChartWidget = ({
    data,
    colorMap,
    unit
}: ChartWidgetProps) => {
    const internalColorMap = colorMap ?? generateColorMap(data);
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart accessibilityLayer>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius="52%"
                    outerRadius="78%"
                    paddingAngle={2}
                    label={({ name, percent }) => `${name} ${Math.round((percent ?? 0) * 100)}%`}
                    isAnimationActive={false}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={internalColorMap[entry.name]} />
                    ))}
                </Pie>
                <text x="50%" y="48%" textAnchor="middle" dominantBaseline="middle" fill="var(--chart-axis)" fontSize="12">Total</text>
                <text x="50%" y="57%" textAnchor="middle" dominantBaseline="middle" fill="var(--ds-ink)" fontSize="20" fontWeight="700">{total}</text>
                <Tooltip content={<ChartTooltip unit={unit} />} />
            </PieChart>
        </ResponsiveContainer>
    );
};
