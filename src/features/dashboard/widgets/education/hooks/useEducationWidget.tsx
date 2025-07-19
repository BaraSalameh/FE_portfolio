import { WidgetCardProps } from "@/components/widgets/types.widgets";
import { useAppSelector } from "@/lib/store/hooks";
import { Clock, GraduationCap } from "lucide-react";
import { CheckChartPreferences, CheckPreferences } from "@/lib/utils/appFunctions";
import { CHART_PREFERENCES, PREFERENCES } from "@/lib/constants";
import { EducationForm } from "../forms";
import { useHandleEducationDelete } from "./useHandleEducationDelete";
import { useDebouncedSortEducation } from "./useDebouncedSortEducation";

export const useEducationWidget = (): WidgetCardProps => {
 
    const { loading: educationLoading, lstEducations } = useAppSelector(state => state.education);
    const { lstUserPreferences } = useAppSelector(state => state.userWidgetPreference);
    const { lstUserChartPreferences } = useAppSelector(state => state.userChartPreference);
    const handleEducationDelete = useHandleEducationDelete();
    const debouncedSortEducation = useDebouncedSortEducation();

    const barData = CheckPreferences(lstUserPreferences, PREFERENCES.KEY.SHOW_EDUCATION_BAR_CHART)
    ?   { 
            groupBy: CheckChartPreferences(
                lstUserChartPreferences,
                {
                    widget: CHART_PREFERENCES.KEY.WIDGET.Education,
                    chartType: CHART_PREFERENCES.KEY.CHART.Bar
                }
            )?.groupBy ?? CHART_PREFERENCES.VALUES.Education.BAR[0].value}
    :   {};

    const pieData = CheckPreferences(lstUserPreferences, PREFERENCES.KEY.SHOW_EDUCATION_PIE_CHART)
    ?   { 
            title: 'Degrees Overview',
            groupBy: CheckChartPreferences(
                lstUserChartPreferences,
                {
                    widget: CHART_PREFERENCES.KEY.WIDGET.Education,
                    chartType: CHART_PREFERENCES.KEY.CHART.Pie
                }
            )?.groupBy ?? CHART_PREFERENCES.VALUES.Education.PIE[0].value }
    :   {};

    const radarData = CheckPreferences(lstUserPreferences, PREFERENCES.KEY.SHOW_EDUCATION_RADAR_CHART)
    ?   { 
            title: 'Degrees Duration Overview',
            groupBy: CheckChartPreferences(
                lstUserChartPreferences,
                {
                    widget: CHART_PREFERENCES.KEY.WIDGET.Education,
                    chartType: CHART_PREFERENCES.KEY.CHART.Radar
                }
            )?.groupBy ?? CHART_PREFERENCES.VALUES.Education.RADAR[0].value}
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