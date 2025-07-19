import { WidgetCardProps } from "@/components/widgets/types.widgets";
import { useAppSelector } from "@/lib/store/hooks";
import { Briefcase, Clock, LocationEdit } from "lucide-react";
import { CheckChartPreferences, CheckPreferences } from "@/lib/utils/appFunctions";
import { CHART_PREFERENCES, PREFERENCES } from "@/lib/constants";
import { ExperienceForm } from "../forms";
import { useHandleExperienceDelete } from "./useHandleExperienceDelete";
import { useDebouncedSortExperience } from "./useDebouncedSortExperience";

export const useExperienceWidget = (): WidgetCardProps => {

    const { loading: experienceLoading, lstExperiences } = useAppSelector(state => state.experience);
    const { lstUserPreferences } = useAppSelector(state => state.userWidgetPreference);
    const { lstUserChartPreferences } = useAppSelector(state => state.userChartPreference);
    const handleExperienceDelete = useHandleExperienceDelete();
    const debouncedSortExperience = useDebouncedSortExperience();

    const barData = CheckPreferences(lstUserPreferences, PREFERENCES.KEY.SHOW_EXPERIENCE_BAR_CHART)
        ?   { 
                groupBy: CheckChartPreferences(
                    lstUserChartPreferences,
                    {
                        widget: CHART_PREFERENCES.KEY.WIDGET.Experience,
                        chartType: CHART_PREFERENCES.KEY.CHART.Bar
                    }
                )?.groupBy ?? CHART_PREFERENCES.VALUES.Experience.BAR[0].value}
        :   {};
    
        const pieData = CheckPreferences(lstUserPreferences, PREFERENCES.KEY.SHOW_EXPERIENCE_PIE_CHART)
        ?   { 
                title: 'Experience Overview',
                groupBy: CheckChartPreferences(
                    lstUserChartPreferences,
                    {
                        widget: CHART_PREFERENCES.KEY.WIDGET.Experience,
                        chartType: CHART_PREFERENCES.KEY.CHART.Pie
                    }
                )?.groupBy ?? CHART_PREFERENCES.VALUES.Experience.PIE[0].value }
        :   {};
    
        const radarData = CheckPreferences(lstUserPreferences, PREFERENCES.KEY.SHOW_EXPERIENCE_RADAR_CHART)
        ?   { 
                title: 'Experience Duration Overview',
                groupBy: CheckChartPreferences(
                    lstUserChartPreferences,
                    {
                        widget: CHART_PREFERENCES.KEY.WIDGET.Experience,
                        chartType: CHART_PREFERENCES.KEY.CHART.Radar
                    }
                )?.groupBy ?? CHART_PREFERENCES.VALUES.Experience.RADAR[0].value}
        :   {};
    
    return {
        isLoading: experienceLoading,
        items: lstExperiences,
        header: { title: 'Experience', icon: Briefcase },
        bar: barData,
        pie: pieData,
        radar: radarData,
        list: [
            { leftKey: 'jobTitle', between: 'at', rightKey: 'companyName', size: 'lg' },
            { leftKey: 'location', icon: LocationEdit },
            { leftKey: 'startDate', between: '-', rightKey: 'endDate', icon: Clock, isTime: true }
        ],
        create: { subTitle: 'Add Experience', form: <ExperienceForm /> },
        update: { subTitle: 'Update Experience', form: <ExperienceForm /> },
        del: { subTitle: 'Delete Experience', message: 'Are you sure?', onDelete: handleExperienceDelete },
        details: [
            { leftKey: 'jobTitle', between: 'at', rightKey: 'companyName', size: 'lg' },
            { leftKey: 'location', icon: LocationEdit },
            { leftKey: 'startDate', between: '-', rightKey: 'endDate', icon: Clock, isTime: true },
            { leftKey: 'description', size: 'sm' }
        ],
        onSort: debouncedSortExperience
    }
}