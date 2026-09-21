import type { Option } from '@/features/types.features';
import type { ChartViewKey } from './types.presentation';
import type { UserWidgetPreferenceResponse } from './profile/settings/widget-preferences/types.widget-preferences';
import { chart_preferences } from '@/lib/utils/constants/chartPreferences';
import { widget_preferences } from '@/lib/utils/constants/widgetPreferences';

export type ChartWidgetKey = 'overview' | 'education' | 'experience' | 'project' | 'skill' | 'language' | 'certificate';
export type LegacyChartTypeKey = 'bar' | 'pie' | 'radar';

type ChartViewPolicy = {
    key: ChartViewKey;
    label: string;
    visibilityKey: string;
};

export type ChartEditorPolicy = {
    view: ChartViewKey;
    title: string;
    description: string;
    chartType: LegacyChartTypeKey;
    groupBy: Option[];
    valueSource: Option[];
};

export type WidgetChartPolicy = {
    title: string;
    widgetName: string;
    preferenceKey: string;
    systemDefault: ChartViewKey;
    views: ChartViewPolicy[];
    editors: ChartEditorPolicy[];
    fixedSummary?: string;
};

const durationValues: Option[] = [
    { label: 'Duration', value: 'duration' },
    { label: 'Entry count', value: 'count' },
];
const countValue: Option[] = [{ label: 'Count', value: 'count' }];

export const widgetChartPolicies: Record<ChartWidgetKey, WidgetChartPolicy> = {
    overview: {
        title: 'Overview',
        widgetName: chart_preferences.key.widget.overview,
        preferenceKey: widget_preferences.key.default_overview_chart,
        systemDefault: 'comparison',
        views: [
            { key: 'comparison', label: 'Section comparison', visibilityKey: widget_preferences.key.show_overview_bar_chart },
            { key: 'composition', label: 'Composition', visibilityKey: widget_preferences.key.show_overview_pie_chart },
        ],
        editors: [],
        fixedSummary: 'Grouped by portfolio section and measured by entry count.',
    },
    education: {
        title: 'Education',
        widgetName: chart_preferences.key.widget.education,
        preferenceKey: widget_preferences.key.default_education_chart,
        systemDefault: 'timeline',
        views: [
            { key: 'timeline', label: 'Timeline', visibilityKey: widget_preferences.key.show_education_bar_chart },
            { key: 'comparison', label: 'Comparison', visibilityKey: widget_preferences.key.show_education_pie_chart },
        ],
        editors: [{
            view: 'comparison',
            title: 'Comparison data',
            description: 'Choose how education entries are grouped and measured.',
            chartType: 'pie',
            groupBy: chart_preferences.values.education.pie,
            valueSource: durationValues,
        }],
    },
    experience: {
        title: 'Experience',
        widgetName: chart_preferences.key.widget.experience,
        preferenceKey: widget_preferences.key.default_experience_chart,
        systemDefault: 'timeline',
        views: [
            { key: 'timeline', label: 'Timeline', visibilityKey: widget_preferences.key.show_experience_bar_chart },
            { key: 'comparison', label: 'Comparison', visibilityKey: widget_preferences.key.show_experience_pie_chart },
        ],
        editors: [{
            view: 'comparison',
            title: 'Comparison data',
            description: 'Choose how career entries are grouped and measured.',
            chartType: 'pie',
            groupBy: chart_preferences.values.experience.pie,
            valueSource: durationValues,
        }],
    },
    project: {
        title: 'Projects',
        widgetName: chart_preferences.key.widget.project,
        preferenceKey: widget_preferences.key.default_project_chart,
        systemDefault: 'comparison',
        views: [
            { key: 'comparison', label: 'Comparison', visibilityKey: widget_preferences.key.show_project_bar_chart },
            { key: 'composition', label: 'Composition', visibilityKey: widget_preferences.key.show_project_pie_chart },
        ],
        editors: [
            {
                view: 'comparison',
                title: 'Comparison data',
                description: 'Choose the dimension used to compare project counts.',
                chartType: 'bar',
                groupBy: chart_preferences.values.project.bar,
                valueSource: countValue,
            },
            {
                view: 'composition',
                title: 'Composition data',
                description: 'Choose the dimension used to calculate project composition.',
                chartType: 'pie',
                groupBy: chart_preferences.values.project.pie,
                valueSource: countValue,
            },
        ],
    },
    skill: {
        title: 'Skills',
        widgetName: chart_preferences.key.widget.skill,
        preferenceKey: widget_preferences.key.default_skill_chart,
        systemDefault: 'matrix',
        views: [
            { key: 'matrix', label: 'Evidence matrix', visibilityKey: widget_preferences.key.show_skill_bar_chart },
            { key: 'comparison', label: 'Evidence comparison', visibilityKey: widget_preferences.key.show_skill_pie_chart },
        ],
        editors: [{
            view: 'comparison',
            title: 'Comparison values',
            description: 'Compare either every evidence link or the number of represented skills.',
            chartType: 'pie',
            groupBy: chart_preferences.values.skill.pie,
            valueSource: [
                { label: 'Evidence links', value: 'evidence' },
                { label: 'Represented skills', value: 'skills' },
            ],
        }],
    },
    language: {
        title: 'Languages',
        widgetName: chart_preferences.key.widget.language,
        preferenceKey: widget_preferences.key.default_language_chart,
        systemDefault: 'comparison',
        views: [
            { key: 'comparison', label: 'Proficiency comparison', visibilityKey: widget_preferences.key.show_language_bar_chart },
            { key: 'profile', label: 'Proficiency profile', visibilityKey: widget_preferences.key.show_language_radar_chart },
        ],
        editors: [],
        fixedSummary: 'Grouped by language and measured on a normalized proficiency percentage scale.',
    },
    certificate: {
        title: 'Certificates',
        widgetName: chart_preferences.key.widget.certificate,
        preferenceKey: widget_preferences.key.default_certificate_chart,
        systemDefault: 'timeline',
        views: [
            { key: 'timeline', label: 'Timeline', visibilityKey: widget_preferences.key.show_certificate_bar_chart },
            { key: 'comparison', label: 'Comparison', visibilityKey: widget_preferences.key.show_certificate_pie_chart },
        ],
        editors: [{
            view: 'comparison',
            title: 'Comparison data',
            description: 'Group certificate counts by credential or associated skill.',
            chartType: 'pie',
            groupBy: chart_preferences.values.certificate.pie,
            valueSource: countValue,
        }],
    },
};

export const getWidgetDefaultView = (
    preferences: UserWidgetPreferenceResponse[],
    widget: ChartWidgetKey,
): ChartViewKey => {
    const policy = widgetChartPolicies[widget];
    const stored = preferences.find((item) => item.preference.name === policy.preferenceKey)?.value as ChartViewKey | undefined;
    return policy.views.some((view) => view.key === stored) ? stored! : policy.systemDefault;
};

export const getChartOption = (
    widget: ChartWidgetKey,
    view: ChartViewKey,
    kind: 'groupBy' | 'valueSource',
    stored?: string | null,
): Option => {
    const options = widgetChartPolicies[widget].editors.find((editor) => editor.view === view)?.[kind] ?? [];
    return options.find((option) => option.value === stored) ?? options[0] ?? { label: 'Unknown', value: '' };
};
