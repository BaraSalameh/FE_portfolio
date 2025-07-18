"use client";

import { CustomTooltip } from "@/components/utils";
import { generateColorMap } from "@/lib/utils/appFunctions";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartWidgetProps } from "./types";
import { useMediaQuery } from 'react-responsive';

export const PieChartWidget = ({
    data,
    colorMap
}: ChartWidgetProps) => {
    const internalColorMap = colorMap ?? generateColorMap(data);
    const isSmall = useMediaQuery({ maxWidth: 640 });
    const isMedium = useMediaQuery({ minWidth: 641, maxWidth: 768 });
    const outerRadius = isSmall ? '50%' : isMedium ? '50%' : '70%';

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={outerRadius}
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={internalColorMap[entry.name]} />
                    ))}
                </Pie>
                <Tooltip content={CustomTooltip} />
            </PieChart>
        </ResponsiveContainer>
    );
};