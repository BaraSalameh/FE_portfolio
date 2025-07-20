import { WidgetCardProps } from "@/components/widgets/types.widgets";
import { useAppSelector } from "@/lib/store/hooks";
import { Clock, GraduationCap } from "lucide-react";
import { checkChartPreferences, checkWidgetPreferences } from "@/lib/utils";
import {chart_preferences, widget_preferences} from "@/lib/utils";
import { EducationForm } from "../forms";
import { useHandleEducationDelete } from "./useHandleEducationDelete";
import { useDebouncedSortEducation } from "./useDebouncedSortEducation";

export const useEducationWidget = (): WidgetCardProps => {
 
    const { loading: educationLoading, lstEducations } = useAppSelector(state => state.education);
    const { lstUserPreferences } = useAppSelector(state => state.userWidgetPreference);
    const { lstUserChartPreferences } = useAppSelector(state => state.userChartPreference);
    const handleEducationDelete = useHandleEducationDelete();
    const debouncedSortEducation = useDebouncedSortEducation();

    const barData = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_education_bar_chart)
    ?   { 
            groupBy: checkChartPreferences(
                lstUserChartPreferences,
                {
                    widget: chart_preferences.key.widget.education,
                    chartType: chart_preferences.key.chart.bar
                }
            )?.groupBy ?? chart_preferences.values.education.bar[0].value}
    :   {};

    const pieData = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_education_pie_chart)
    ?   { 
            title: 'Degrees Overview',
            groupBy: checkChartPreferences(
                lstUserChartPreferences,
                {
                    widget: chart_preferences.key.widget.education,
                    chartType: chart_preferences.key.chart.pie
                }
            )?.groupBy ?? chart_preferences.values.education.pie[0].value }
    :   {};

    const radarData = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_education_radar_chart)
    ?   { 
            title: 'Degrees Duration Overview',
            groupBy: checkChartPreferences(
                lstUserChartPreferences,
                {
                    widget: chart_preferences.key.widget.education,
                    chartType: chart_preferences.key.chart.radar
                }
            )?.groupBy ?? chart_preferences.values.education.radar[0].value}
    :   {};
    
    return {
        isLoading: educationLoading,
        items: lstEducations,
        header: { title: 'Education', icon: GraduationCap },
        bar: barData,
        pie: pieData,
        radar: radarData,
        list: [
            { leftKey: 'degree.abbreviation', between: 'at', rightKey: 'institution.name', size: 'lg' },
            { leftKey: 'fieldOfStudy.name', icon: GraduationCap },
            { leftKey: 'startDate', between: '-', rightKey: 'endDate', icon: Clock, isTime: true }
        ],
        create: { subTitle: 'Add Education', form: <EducationForm /> },
        update: { subTitle: 'Update Education', form: <EducationForm /> },
        del: { subTitle: 'Delete education', message: 'Are you sure?', onDelete: handleEducationDelete },
        details: [
            { leftKey: 'degree.name', between: 'at', rightKey: 'institutionname', size: 'lg' },
            { leftKey: 'fieldOfStudy.name', icon: GraduationCap },
            { leftKey: 'startDate', between: '-', rightKey: 'endDate', icon: Clock, isTime: true },
            { leftKey: 'description', size: 'sm' }
        ],
        onSort: debouncedSortEducation
    }
}