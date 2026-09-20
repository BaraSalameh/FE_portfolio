import { WidgetCardProps } from '@/features/dashboard/types.presentation';
import { useAppSelector } from "@/lib/store/hooks";
import { Briefcase, Clock, LocationEdit } from "lucide-react";
import { checkChartPreferences, checkWidgetPreferences } from "@/lib/utils";
import {chart_preferences, widget_preferences} from "@/lib/utils";
import { ExperienceForm } from "../forms";
import { useHandleExperienceDelete } from "./useHandleExperienceDelete";
import { useDebouncedSortExperience } from "./useDebouncedSortExperience";

export const useExperienceWidget = (): WidgetCardProps => {

    const { loading: experienceLoading, error, lstExperiences } = useAppSelector(state => state.experience);
    const { lstUserPreferences } = useAppSelector(state => state.userWidgetPreference);
    const { lstUserChartPreferences } = useAppSelector(state => state.userChartPreference);
    const handleExperienceDelete = useHandleExperienceDelete();
    const debouncedSortExperience = useDebouncedSortExperience();

    const showTimeline = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_experience_bar_chart);
    const showComparison = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_experience_pie_chart);
    const comparisonPreference = checkChartPreferences(
        lstUserChartPreferences,
        { widget: chart_preferences.key.widget.experience, chartType: chart_preferences.key.chart.pie }
    );
    const groupBy = comparisonPreference?.groupBy ?? chart_preferences.values.experience.pie[0].value;
    const comparisonIsCount = comparisonPreference?.valueSource === 'count';
    const barData = showComparison
        ?   { 
                title: comparisonIsCount ? 'Experience entries by role' : 'Experience duration by role',
                description: comparisonIsCount ? 'Number of experience entries for each selected grouping.' : 'Total recorded duration for each selected grouping.',
                metricLabel: comparisonIsCount ? 'Experience entries' : 'Career duration',
                groupBy, measure: comparisonIsCount ? 'count' as const : 'duration' as const, unit: comparisonIsCount ? 'items' as const : 'months' as const }
        :   undefined;
    const timeline = showTimeline ? {
        title: 'Career timeline',
        data: lstExperiences.map((item) => ({ id: item.id, name: item.jobTitle, detail: item.companyName, start: item.startDate, end: item.endDate, ongoing: !item.endDate }))
    } : undefined;
    
    return {
        isLoading: experienceLoading,
        error,
        items: lstExperiences,
        entryPresentation: { variant: 'experience', singularLabel: 'Experience' },
        header: { title: 'Experience', icon: Briefcase, description: 'Roles, responsibilities, and career history' },
        emptyState: { title: 'No experience added', description: 'Add a role to highlight where you worked and what you accomplished.' },
        bar: barData,
        timeline,
        list: [
            { leftKey: 'jobTitle', between: 'at', rightKey: 'companyName', size: 'lg' },
            { leftKey: 'location', icon: LocationEdit },
            { leftKey: 'startDate', between: '-', rightKey: 'endDate', icon: Clock, isTime: true }
        ],
        create: { title: 'Add', subTitle: 'Add experience', form: <ExperienceForm /> },
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
