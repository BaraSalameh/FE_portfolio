import { ChartEntry, WidgetCardProps } from '@/features/dashboard/types.presentation';
import { useAppSelector } from "@/lib/store/hooks";
import { ListTodo, StarIcon } from "lucide-react";
import { UserSkillForm } from "../forms";
import { chart_preferences, checkChartPreferences, checkWidgetPreferences, widget_preferences } from "@/lib/utils";
import { UserSkillResponse } from "../types.skill";
import { getChartOption, getWidgetDefaultView } from '@/features/dashboard/chartPolicies';

export const useSkillWidget = (): WidgetCardProps => {

    const { loading, error, lstUserSkills } = useAppSelector(state => state.userSkill);
    const { lstUserPreferences } = useAppSelector(state => state.userWidgetPreference);

    const { lstUserChartPreferences } = useAppSelector(state => state.userChartPreference);
    const comparisonPreference = checkChartPreferences(
        lstUserChartPreferences,
        { widget: chart_preferences.key.widget.skill, chartType: chart_preferences.key.chart.pie }
    );
    const valueOption = getChartOption('skill', 'comparison', 'valueSource', comparisonPreference?.valueSource);
    const countEvidenceLinks = valueOption.value === 'evidence';

    const counts = lstUserSkills.reduce((acc: Record<'experience' | 'project' | 'education' | 'certificate', number>, item: UserSkillResponse) => {
        const contribution = (length: number) => countEvidenceLinks ? length : length > 0 ? 1 : 0;
        if (item.lstExperiences) acc.experience += contribution(item.lstExperiences.length);
        if (item.lstProjects) acc.project += contribution(item.lstProjects.length);
        if (item.lstEducations) acc.education += contribution(item.lstEducations.length);
        if (item.lstCertificates) acc.certificate += contribution(item.lstCertificates.length);
        return acc;
    }, {
        experience: 0,
        project: 0,
        education: 0,
        certificate: 0
    });

    const customData: ChartEntry[] = Object.entries(counts as Record<string, number>).map(
        ([key, value]) => ({
            name: key,
            value: value
        })
    );

    const showMatrix = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_skill_bar_chart);
    const barData = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_skill_pie_chart)
        ? {
            title: countEvidenceLinks ? 'Evidence links by source' : 'Represented skills by evidence source',
            description: countEvidenceLinks
                ? 'Total linked portfolio records for each evidence source.'
                : 'Number of skills represented at least once in each evidence source.',
            metricLabel: countEvidenceLinks ? 'Evidence links' : 'Represented skills',
            customData,
            measure: 'count' as const,
            unit: 'items' as const,
        }
        : undefined;
    const matrix = showMatrix ? {
        title: 'Skill evidence matrix',
        rows: lstUserSkills.map((item) => ({
            name: item.skill.name,
            projects: item.lstProjects?.length ?? 0,
            experience: item.lstExperiences?.length ?? 0,
            education: item.lstEducations?.length ?? 0,
            certificates: item.lstCertificates?.length ?? 0
        }))
    } : undefined;

    return {
        isLoading: loading,
        error,
        items: lstUserSkills,
        entryPresentation: { variant: 'skill', singularLabel: 'Skill' },
        header: { title: 'Skills', icon: StarIcon, description: 'Capabilities connected to your portfolio work' },
        emptyState: { title: 'No skills added', description: 'Add skills and connect them to projects, experience, education, or certificates.' },
        bar: barData,
        matrix,
        defaultView: getWidgetDefaultView(lstUserPreferences, 'skill'),
        list: [  { leftKey: 'skill.name', size: 'lg' } ],
        create: { title: 'Manage', subTitle: 'Manage skills', form: <UserSkillForm />, icon: ListTodo},
    }
}
