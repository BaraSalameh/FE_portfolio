'use client';

import { useId, useMemo, useState } from 'react';
import type { ChartConfig, ChartEntry, WidgetChartsProps } from '@/features/dashboard/types.presentation';
import { generateColorMap, generateDurationData, generatePieData } from '@/lib/utils';
import { BarChartWidget } from './BarChart';
import { ChartFrame } from './ChartFrame';
import { EvidenceMatrix } from './EvidenceMatrix';
import { KpiGrid } from './KpiGrid';
import { PieChartWidget } from './PieChart';
import { RadarChartWidget } from './RadarChart';
import { TimelineChart } from './TimelineChart';

const hasConfig = (config?: ChartConfig) => Boolean(config && (config.customData?.length || config.groupBy));

const limitData = (data: ChartEntry[], maxItems = 8) => {
    const sorted = [...data].filter((item) => Number.isFinite(item.value)).sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));
    if (sorted.length <= maxItems) return sorted;
    const visible = sorted.slice(0, maxItems);
    const other = sorted.slice(maxItems).reduce((sum, item) => sum + item.value, 0);
    return [...visible, { name: 'Other', value: other }];
};

export const WidgetCharts = ({ items, pie, bar, radar, timeline, matrix, kpis }: WidgetChartsProps) => {
    const tabsId = useId();
    const barData = useMemo(() => {
        if (!hasConfig(bar)) return [];
        const raw = bar?.customData ?? (bar?.measure === 'count'
            ? generatePieData(items ?? [], bar.groupBy)
            : generateDurationData(items ?? [], bar?.groupBy, bar?.durationKeys?.start, bar?.durationKeys?.end));
        return limitData(raw, bar?.maxItems);
    }, [items, bar]);
    const pieData = useMemo(() => hasConfig(pie) ? limitData(pie?.customData ?? generatePieData(items ?? [], pie?.groupBy), 5) : [], [items, pie]);
    const radarData = useMemo(() => hasConfig(radar) ? limitData(radar?.customData ?? [], 8) : [], [radar]);
    const barTotal = barData.reduce((sum, item) => sum + item.value, 0);
    const pieTotal = pieData.reduce((sum, item) => sum + item.value, 0);
    const radarTotal = radarData.reduce((sum, item) => sum + item.value, 0);
    const barColors = useMemo(() => generateColorMap(barData), [barData]);
    const pieColors = useMemo(() => generateColorMap(pieData), [pieData]);

    const views = [
        timeline?.data.length ? { key: 'timeline', label: 'Timeline', node: <TimelineChart config={timeline} /> } : null,
        matrix?.rows.length ? { key: 'matrix', label: 'Evidence', node: <EvidenceMatrix config={matrix} /> } : null,
        barData.length ? { key: 'bar', label: 'Comparison', node: <ChartFrame title={bar?.title ?? 'Comparison'} description={bar?.description} data={barData} unit={bar?.unit}><BarChartWidget data={barData} colorMap={barColors} unit={bar?.unit} measure={bar?.measure} metricLabel={bar?.metricLabel} total={barTotal} /></ChartFrame> } : null,
        pieData.length ? { key: 'pie', label: 'Composition', node: <ChartFrame title={pie?.title ?? 'Composition'} description={pie?.description} data={pieData} unit={pie?.unit}><PieChartWidget data={pieData} colorMap={pieColors} unit={pie?.unit} measure={pie?.measure} metricLabel={pie?.metricLabel} total={pieTotal} /></ChartFrame> } : null,
        radarData.length ? { key: 'radar', label: 'Profile', node: <ChartFrame title={radar?.title ?? 'Profile'} description={radar?.description} data={radarData} unit={radar?.unit}><RadarChartWidget data={radarData} unit={radar?.unit} measure={radar?.measure} metricLabel={radar?.metricLabel} total={radarTotal} /></ChartFrame> } : null,
    ].filter((view): view is NonNullable<typeof view> => Boolean(view)).slice(0, 2);
    const [selected, setSelected] = useState(0);
    const selectedIndex = Math.min(selected, Math.max(views.length - 1, 0));
    const active = views[selectedIndex];

    if (!kpis?.length && !active) return null;

    return (
        <div className="space-y-4">
            {kpis?.length ? <KpiGrid items={kpis} /> : null}
            {views.length > 1 ? (
                <div className="inline-flex rounded-xl border border-line bg-canvas-subtle p-1" role="tablist" aria-label="Chart view">
                    {views.map((view, index) => <button key={view.key} id={`${tabsId}-${view.key}-tab`} type="button" role="tab" aria-selected={index === selectedIndex} aria-controls={`${tabsId}-${view.key}-panel`} tabIndex={index === selectedIndex ? 0 : -1} onClick={() => setSelected(index)} className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${index === selectedIndex ? 'bg-surface text-ink shadow-sm' : 'text-ink-muted hover:text-ink'}`}>{view.label}</button>)}
                </div>
            ) : null}
            {active ? <div id={`${tabsId}-${active.key}-panel`} role={views.length > 1 ? 'tabpanel' : undefined} aria-labelledby={views.length > 1 ? `${tabsId}-${active.key}-tab` : undefined}>{active.node}</div> : null}
        </div>
    );
};
