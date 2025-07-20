import { WidgetCardProps } from "@/components/widgets/types.widgets";
import { useAppSelector } from "@/lib/store/hooks";
import { Briefcase, Clock, LocationEdit } from "lucide-react";
import { checkChartPreferences, checkWidgetPreferences } from "@/lib/utils";
import {chart_preferences, widget_preferences} from "@/lib/utils";
import { ExperienceForm } from "../forms";
import { useHandleExperienceDelete } from "./useHandleExperienceDelete";
import { useDebouncedSortExperience } from "./useDebouncedSortExperience";

export const useExperienceWidget = (): WidgetCardProps => {

    const { loading: experienceLoading, lstExperiences } = useAppSelector(state => state.experience);
    const { lstUserPreferences } = useAppSelector(state => state.userWidgetPreference);
    const { lstUserChartPreferences } = useAppSelector(state => state.userChartPreference);
    const handleExperienceDelete = useHandleExperienceDelete();
    const debouncedSortExperience = useDebouncedSortExperience();

    const barData = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_experience_bar_chart)
        ?   { 
                groupBy: checkChartPreferences(
                    lstUserChartPreferences,
                    {
                        widget: chart_preferences.key.widget.experience,
                        chartType: chart_preferences.key.chart.bar
                    }
                )?.groupBy ?? chart_preferences.values.experience.bar[0].value}
        :   {};
    
        const pieData = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_experience_pie_chart)
        ?   { 
                title: 'Experience Overview',
                groupBy: checkChartPreferences(
                    lstUserChartPreferences,
                    {
                        widget: chart_preferences.key.widget.experience,
                        chartType: chart_preferences.key.chart.pie
                    }
                )?.groupBy ?? chart_preferences.values.experience.pie[0].value }
        :   {};
    
        const radarData = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_experience_radar_chart)
        ?   { 
                title: 'Experience Duration Overview',
                groupBy: checkChartPreferences(
                    lstUserChartPreferences,
                    {
                        widget: chart_preferences.key.widget.experience,
                        chartType: chart_preferences.key.chart.radar
                    }
                )?.groupBy ?? chart_preferences.values.experience.radar[0].value}
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