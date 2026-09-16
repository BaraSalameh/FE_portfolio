import { WidgetCardProps } from '@/features/dashboard/types.presentation';
import { useAppSelector } from "@/lib/store/hooks";
import { Clock, GraduationCap } from "lucide-react";
import { checkChartPreferences, checkWidgetPreferences } from "@/lib/utils";
import {chart_preferences, widget_preferences} from "@/lib/utils";
import { EducationForm } from "../forms";
import { useHandleEducationDelete } from "./useHandleEducationDelete";
import { useDebouncedSortEducation } from "./useDebouncedSortEducation";

export const useEducationWidget = (): WidgetCardProps => {
 
    const { loading: educationLoading, error, lstEducations } = useAppSelector(state => state.education);
    const { lstUserPreferences } = useAppSelector(state => state.userWidgetPreference);
    const { lstUserChartPreferences } = useAppSelector(state => state.userChartPreference);
    const handleEducationDelete = useHandleEducationDelete();
    const debouncedSortEducation = useDebouncedSortEducation();

    const showTimeline = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_education_bar_chart);
    const showComparison = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_education_pie_chart);
    const comparisonPreference = checkChartPreferences(
        lstUserChartPreferences,
        { widget: chart_preferences.key.widget.education, chartType: chart_preferences.key.chart.pie }
    );
    const groupBy = comparisonPreference?.groupBy ?? chart_preferences.values.education.pie[0].value;
    const comparisonIsCount = comparisonPreference?.valueSource === 'count';

    const barData = showComparison
    ?   { 
            title: comparisonIsCount ? 'Education entries by qualification' : 'Study duration by qualification',
            description: comparisonIsCount ? 'Number of education entries for each selected grouping.' : 'Total recorded study duration for each selected grouping.',
            groupBy, measure: comparisonIsCount ? 'count' as const : 'duration' as const, unit: comparisonIsCount ? 'items' as const : 'months' as const }
    :   undefined;
    const timeline = showTimeline ? {
        title: 'Education timeline',
        data: lstEducations.map((item) => ({ id: item.id, name: item.degree.abbreviation || item.degree.name, detail: item.institution.name, start: item.startDate, end: item.endDate, ongoing: item.isStudying }))
    } : undefined;
    
    return {
        isLoading: educationLoading,
        error,
        items: lstEducations,
        header: { title: 'Education', icon: GraduationCap, description: 'Academic background and areas of study' },
        emptyState: { title: 'No education added', description: 'Add a school, degree, and study period to introduce your academic background.' },
        bar: barData,
        timeline,
        list: [
            { leftKey: 'degree.abbreviation', between: 'at', rightKey: 'institution.name', size: 'lg' },
            { leftKey: 'fieldOfStudy.name', icon: GraduationCap },
            { leftKey: 'startDate', between: '-', rightKey: 'endDate', icon: Clock, isTime: true }
        ],
        create: { title: 'Add', subTitle: 'Add education', form: <EducationForm /> },
        update: { subTitle: 'Update Education', form: <EducationForm /> },
        del: { subTitle: 'Delete education', message: 'Are you sure?', onDelete: handleEducationDelete },
        details: [
            { leftKey: 'degree.name', between: 'at', rightKey: 'institution.name', size: 'lg' },
            { leftKey: 'fieldOfStudy.name', icon: GraduationCap },
            { leftKey: 'startDate', between: '-', rightKey: 'endDate', icon: Clock, isTime: true },
            { leftKey: 'description', size: 'sm' }
        ],
        onSort: debouncedSortEducation
    }
}
