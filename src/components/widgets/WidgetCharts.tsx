import { Paragraph } from '../ui';
import { PieChartWidget, BarChartWidget } from '.';
import { WidgetChartsProps } from './types.widgets';
import { RadarChartWidget } from './RadarChart';
import { useMemo } from 'react';
import { generateColorMap, generateDurationData, generatePieData } from '@/lib/utils/appFunctions';

export const WidgetCharts = ({ items, pie, bar, radar }: WidgetChartsProps) => {

    const pieData = useMemo(() => pie ? pie.customData ?? generatePieData(items ?? [], pie?.groupBy) : [], [items, pie]);
    const barData = useMemo(
        () => bar ? bar.customData ?? generateDurationData(items ?? [], bar?.groupBy, bar.durationKeys?.start, bar.durationKeys?.end) : [],
        [items, bar]
    );
    const radarData = useMemo(
        () => radar ? radar.customData ?? generateDurationData(items ?? [], radar?.groupBy) : [],
        [items, radar]
    );
    const barColorMap = useMemo(() => generateColorMap(barData), [barData]);
    const pieColorMap = useMemo(() => generateColorMap(pieData), [pieData]);
    
    return (
        <div
            className={`w-full sm:grid gap-4 
            ${pieData?.length && barData?.length && radarData?.length
                ? 'grid-cols-3 auto-rows-min'
                : pieData?.length && radarData?.length
                ? 'grid-cols-3'
                : pieData?.length && barData?.length
                ? 'grid-cols-3'
                : barData?.length && radarData?.length
                ? 'grid-cols-3'
                : 'grid-cols-1'
            }`}
        >
            {pieData?.length > 0 && (
                <div
                    className={`h-64 space-y-3
                    ${barData?.length && radarData?.length
                        ? 'col-span-1'
                        : barData?.length || radarData?.length
                        ? 'col-span-1'
                        : 'col-span-3'
                    }`}
                >
                    <Paragraph size="md" position="center">{pie?.title ?? 'Distribution'}</Paragraph>
                    <PieChartWidget data={pieData} colorMap={pieColorMap} />
                </div>
            )}

            {radarData?.length > 0 && (
                <div
                    className={`h-64 space-y-3
                    ${pieData?.length && barData?.length
                        ? 'col-span-2'
                        : pieData?.length || barData?.length
                        ? 'col-span-2'
                        : 'col-span-1'
                    }`}
                >
                    <Paragraph size="md" position="center">{radar?.title ?? 'Distribution'}</Paragraph>
                    <RadarChartWidget data={radarData} />
                </div>
            )}

            {barData?.length > 0 && (
                <div
                    className={`h-64 space-y-3
                    ${pieData?.length && radarData?.length
                        ? 'col-span-3'
                        : pieData?.length
                        ? 'col-span-2'
                        : radarData?.length
                        ? 'col-span-1'
                        : 'col-span-3'
                    }`}
                >
                    <Paragraph size="md" position="center">{bar?.title ?? 'Duration (in months)'}</Paragraph>
                    <BarChartWidget data={barData} colorMap={barColorMap} />
                </div>
            )}
        </div>
)};
