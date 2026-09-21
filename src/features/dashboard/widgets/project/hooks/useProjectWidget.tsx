import { WidgetCardProps } from '@/features/dashboard/types.presentation';
import { useAppSelector } from "@/lib/store/hooks";
import { Folder, Link, SearchCodeIcon, WandSparklesIcon } from "lucide-react";
import { checkChartPreferences, checkWidgetPreferences } from "@/lib/utils";
import { chart_preferences, widget_preferences } from "@/lib/utils";
import { useHandleProjectDelete } from "./useHandleProjectDelete";
import { useDebouncedSortProject } from "./useDebouncedSortProject";
import { ProjectForm } from "../forms";
import { getChartOption, getWidgetDefaultView } from '@/features/dashboard/chartPolicies';

export const useProjectWidget = (): WidgetCardProps => {
    
    const { loading: projectTechnologyLoading, error, lstProjects } = useAppSelector(state => state.project);
    const { lstUserPreferences } = useAppSelector(state => state.userWidgetPreference);
    const { lstUserChartPreferences } = useAppSelector(state => state.userChartPreference);
    const handleProjectDelete = useHandleProjectDelete();
    const debouncedSortProject = useDebouncedSortProject();

    const comparisonPreference = checkChartPreferences(
        lstUserChartPreferences,
        { widget: chart_preferences.key.widget.project, chartType: chart_preferences.key.chart.bar }
    );
    const compositionPreference = checkChartPreferences(
        lstUserChartPreferences,
        { widget: chart_preferences.key.widget.project, chartType: chart_preferences.key.chart.pie }
    );
    const comparisonGroup = getChartOption('project', 'comparison', 'groupBy', comparisonPreference?.groupBy);
    const compositionGroup = getChartOption('project', 'composition', 'groupBy', compositionPreference?.groupBy);
    const featuredData = lstProjects.reduce((counts, project) => {
        const key = project.isFeatured ? 'Featured' : 'Standard';
        counts[key] = (counts[key] ?? 0) + 1;
        return counts;
    }, {} as Record<string, number>);
    const getFeaturedData = (groupBy: string) => groupBy === 'isFeatured'
        ? Object.entries(featuredData).map(([name, value]) => ({ name, value }))
        : undefined;

    const showComparison = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_project_bar_chart);
    const barData = showComparison
        ?   {
                title: `Projects by ${comparisonGroup.label.toLowerCase()}`,
                description: 'Project count for the selected grouping.',
                metricLabel: 'Projects',
                groupBy: comparisonGroup.value,
                customData: getFeaturedData(comparisonGroup.value),
                measure: 'count' as const,
                unit: 'items' as const}
        :   undefined;
    
        const pieData = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_project_pie_chart)
        ?   { 
                title: `Project composition by ${compositionGroup.label.toLowerCase()}`,
                description: 'Share of projects across the selected grouping.',
                metricLabel: 'Projects',
                groupBy: compositionGroup.value,
                customData: getFeaturedData(compositionGroup.value),
                measure: 'count' as const,
                unit: 'items' as const }
        :   undefined;

    return {
        isLoading: projectTechnologyLoading,
        error,
        items: lstProjects,
        entryPresentation: { variant: 'project', singularLabel: 'Project' },
        header: { title: 'Projects', icon: Folder, description: 'Selected work, outcomes, and technologies' },
        emptyState: { title: 'No projects added', description: 'Add a project to demonstrate your work, process, and technical impact.' },
        bar: barData,
        pie: pieData,
        defaultView: getWidgetDefaultView(lstUserPreferences, 'project'),
        list: [
            { leftKey: 'title', between: '-', rightKey: ['experience.companyName', 'education.institution.name'], size: 'lg' },
            { leftKey: 'isFeatured' }
        ],
        create: { title: 'Add', subTitle: 'Add project', form: <ProjectForm /> },
        update: { subTitle: 'Update Project & technologies', form: <ProjectForm /> },
        del: { subTitle: 'Delete Project', message: 'Are you sure?', onDelete: handleProjectDelete },
        details: [
            { leftKey: 'title', size: 'lg' },
            { leftKey: 'liveLink', icon: Link, isLink: true, label: 'View live project' },
            { leftKey: 'sourceCode', icon: SearchCodeIcon, isLink: true, label: 'View source code' },
            { leftKey: 'lstSkills.name', icon: WandSparklesIcon, itemIcon: 'lstSkills.iconUrl' },
            { leftKey: 'description', size: 'sm' }
        ],
        onSort: debouncedSortProject
    }
}
