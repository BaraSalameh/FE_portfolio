"use client";

import { chartTooltip } from '@/lib/ui/chartTooltip';
import { generateColorMap } from "@/lib/utils";
import { Cell, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartWidgetProps } from '@/features/dashboard/types.presentation';

export const BarChartWidget = ({
    data,
    colorMap
}: ChartWidgetProps) => {
    const internalColorMap = colorMap ?? generateColorMap(data);

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={chartTooltip} />
                <Bar
                    dataKey="value"
                    radius={[10, 0, 10, 0]}
                    fillOpacity={1}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-bar-${index}`} fill={internalColorMap[entry.name]} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};
