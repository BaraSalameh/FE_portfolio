import { WidgetCardProps } from '@/features/dashboard/types.presentation';
import { useAppSelector } from "@/lib/store/hooks";
import { Folder, Link, SearchCodeIcon, WandSparklesIcon } from "lucide-react";
import { checkChartPreferences, checkWidgetPreferences } from "@/lib/utils";
import { chart_preferences, widget_preferences } from "@/lib/utils";
import { useHandleProjectDelete } from "./useHandleProjectDelete";
import { useDebouncedSortProject } from "./useDebouncedSortProject";
import { ProjectForm } from "../forms";

export const useProjectWidget = (): WidgetCardProps => {
    
    const { loading: projectTechnologyLoading, error, lstProjects } = useAppSelector(state => state.project);
    const { lstUserPreferences } = useAppSelector(state => state.userWidgetPreference);
    const { lstUserChartPreferences } = useAppSelector(state => state.userChartPreference);
    const handleProjectDelete = useHandleProjectDelete();
    const debouncedSortProject = useDebouncedSortProject();

    const showComparison = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_project_bar_chart);
    const barData = showComparison
        ?   {
                title: 'Projects by technology or context',
                description: 'Project count for the selected grouping.',
                metricLabel: 'Projects',
                groupBy: checkChartPreferences(
                    lstUserChartPreferences,
                    {
                        widget: chart_preferences.key.widget.project,
                        chartType: chart_preferences.key.chart.bar
                    }
                )?.groupBy ?? chart_preferences.values.project.bar[0].value,
                measure: 'count' as const,
                unit: 'items' as const}
        :   undefined;
    
        const pieData = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_project_pie_chart)
        ?   { 
                title: 'Project composition',
                description: 'Share of projects across the selected grouping.',
                metricLabel: 'Projects',
                groupBy: checkChartPreferences(
                    lstUserChartPreferences,
                    {
                        widget: chart_preferences.key.widget.project,
                        chartType: chart_preferences.key.chart.pie
                    }
                )?.groupBy ?? chart_preferences.values.project.pie[0].value,
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
