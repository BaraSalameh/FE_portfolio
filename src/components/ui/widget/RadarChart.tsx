import { CustomTooltip } from "@/components/utils";
import { ResponsiveContainer, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from "recharts";
import { ChartWidgetProps } from "./types";
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
                <Tooltip content={CustomTooltip} />
            </RadarChart>
      </ResponsiveContainer>
    );
};