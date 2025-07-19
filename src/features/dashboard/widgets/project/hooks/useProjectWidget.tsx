import { WidgetCardProps } from "@/components/widgets/types.widgets";
import { useAppSelector } from "@/lib/store/hooks";
import { Folder, Link, SearchCodeIcon, WandSparklesIcon } from "lucide-react";
import { CheckChartPreferences, CheckPreferences } from "@/lib/utils/appFunctions";
import { CHART_PREFERENCES, PREFERENCES } from "@/lib/constants";
import { useHandleProjectDelete } from "./useHandleProjectDelete";
import { useDebouncedSortProject } from "./useDebouncedSortProject";
import { ProjectTechnologyForm } from "../forms";

export const useProjectWidget = (): WidgetCardProps => {
    
    const { loading: projectTechnologyLoading, lstProjectTechnologies } = useAppSelector(state => state.projectTechnology);
    const { lstUserPreferences } = useAppSelector(state => state.userWidgetPreference);
    const { lstUserChartPreferences } = useAppSelector(state => state.userChartPreference);
    const handleProjectDelete = useHandleProjectDelete();
    const debouncedSortProject = useDebouncedSortProject();

    const barData = CheckPreferences(lstUserPreferences, PREFERENCES.KEY.SHOW_PROJECT_BAR_CHART)
        ?   { 
                groupBy: CheckChartPreferences(
                    lstUserChartPreferences,
                    {
                        widget: CHART_PREFERENCES.KEY.WIDGET.Project,
                        chartType: CHART_PREFERENCES.KEY.CHART.Bar
                    }
                )?.groupBy ?? CHART_PREFERENCES.VALUES.Project.BAR[0].value}
        :   {};
    
        const pieData = CheckPreferences(lstUserPreferences, PREFERENCES.KEY.SHOW_PROJECT_PIE_CHART)
        ?   { 
                title: 'technologies Overview',
                groupBy: CheckChartPreferences(
                    lstUserChartPreferences,
                    {
                        widget: CHART_PREFERENCES.KEY.WIDGET.Project,
                        chartType: CHART_PREFERENCES.KEY.CHART.Pie
                    }
                )?.groupBy ?? CHART_PREFERENCES.VALUES.Project.PIE[0].value }
        :   {};
    
        const radarData = CheckPreferences(lstUserPreferences, PREFERENCES.KEY.SHOW_PROJECT_RADAR_CHART)
        ?   { 
                title: 'Degrees Duration Overview',
                groupBy: CheckChartPreferences(
                    lstUserChartPreferences,
                    {
                        widget: CHART_PREFERENCES.KEY.WIDGET.Project,
                        chartType: CHART_PREFERENCES.KEY.CHART.Radar
                    }
                )?.groupBy ?? CHART_PREFERENCES.VALUES.Project.RADAR[0].value}
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