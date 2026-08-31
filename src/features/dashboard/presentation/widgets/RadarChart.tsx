"use client";

import { chartTooltip } from '@/lib/ui/chartTooltip';
import { ResponsiveContainer, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { ChartWidgetProps } from '@/features/dashboard/types.presentation';
import { useMediaQuery } from "react-responsive";

export const RadarChartWidget = ({
    data
}: ChartWidgetProps) => {

    const isSmall = useMediaQuery({ maxWidth: 640 });
    const isMedium = useMediaQuery({ minWidth: 641, maxWidth: 768 });
    const outerRadius = isSmall ? '50%' : isMedium ? '50%' : '70%';
    
    return (
        <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius={outerRadius} data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <Radar
                    dataKey="value"
                    stroke="#3B82F6"
                    fill="#F97316"
                    fillOpacity={0.7}
                />
                <Tooltip content={chartTooltip} />
            </RadarChart>
      </ResponsiveContainer>
    );
};
