import { WidgetCardProps } from "@/components/widgets/types.widgets";
import { useAppSelector } from "@/lib/store/hooks";
import { Folder, Link, SearchCodeIcon, WandSparklesIcon } from "lucide-react";
import { checkChartPreferences, checkWidgetPreferences } from "@/lib/utils";
import { chart_preferences, widget_preferences } from "@/lib/utils";
import { useHandleProjectDelete } from "./useHandleProjectDelete";
import { useDebouncedSortProject } from "./useDebouncedSortProject";
import { ProjectTechnologyForm } from "../forms";

export const useProjectWidget = (): WidgetCardProps => {
    
    const { loading: projectTechnologyLoading, lstProjectTechnologies } = useAppSelector(state => state.projectTechnology);
    const { lstUserPreferences } = useAppSelector(state => state.userWidgetPreference);
    const { lstUserChartPreferences } = useAppSelector(state => state.userChartPreference);
    const handleProjectDelete = useHandleProjectDelete();
    const debouncedSortProject = useDebouncedSortProject();

    const barData = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_project_bar_chart)
        ?   { 
                groupBy: checkChartPreferences(
                    lstUserChartPreferences,
                    {
                        widget: chart_preferences.key.widget.project,
                        chartType: chart_preferences.key.chart.bar
                    }
                )?.groupBy ?? chart_preferences.values.project.bar[0].value}
        :   {};
    
        const pieData = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_project_pie_chart)
        ?   { 
                title: 'technologies Overview',
                groupBy: checkChartPreferences(
                    lstUserChartPreferences,
                    {
                        widget: chart_preferences.key.widget.project,
                        chartType: chart_preferences.key.chart.pie
                    }
                )?.groupBy ?? chart_preferences.values.project.pie[0].value }
        :   {};
    
        const radarData = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_project_radar_chart)
        ?   { 
                title: 'Degrees Duration Overview',
                groupBy: checkChartPreferences(
                    lstUserChartPreferences,
                    {
                        widget: chart_preferences.key.widget.project,
                        chartType: chart_preferences.key.chart.radar
                    }
                )?.groupBy ?? chart_preferences.values.project.radar[0].value}
        :   {};

    return {
        isLoading: projectTechnologyLoading,
        items: lstProjectTechnologies,
        header: { title: 'Project', icon: Folder },
        bar: barData,
        radar: radarData,
        pie: pieData,
        list: [
            { leftKey: 'title', between: '-', rightKey: ['experience.companyName', 'education.institution.name'], size: 'lg' },
            { leftKey: 'isFeatured' }
        ],
        create: { subTitle: 'Add Project & technologis', form: <ProjectTechnologyForm /> },
        update: { subTitle: 'Update Project & technologies', form: <ProjectTechnologyForm /> },
        del: { subTitle: 'Delete Project', message: 'Are you sure?', onDelete: handleProjectDelete },
        details: [
            { leftKey: 'title', size: 'lg' },
            { leftKey: 'liveLink', icon: Link, isLink: true },
            { leftKey: 'sourceCode', icon: SearchCodeIcon , isLink: true},
            { leftKey: 'lstTechnologies.name', icon: WandSparklesIcon, itemIcon: 'lstTechnologies.iconUrl' },
            { leftKey: 'description', size: 'sm' }
        ],
        onSort: debouncedSortProject
    }
}