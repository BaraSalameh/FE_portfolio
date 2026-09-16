import { ChartEntry, WidgetCardProps } from '@/features/dashboard/types.presentation';
import { useAppSelector } from "@/lib/store/hooks";
import { ListTodo, StarIcon } from "lucide-react";
import { UserSkillForm } from "../forms";
import { checkWidgetPreferences, widget_preferences } from "@/lib/utils";
import { UserSkillResponse } from "../types.skill";

export const useSkillWidget = (): WidgetCardProps => {

    const { loading, error, lstUserSkills } = useAppSelector(state => state.userSkill);
    const { lstUserPreferences } = useAppSelector(state => state.userWidgetPreference);

    const counts = lstUserSkills.reduce((acc: Record<'experience' | 'project' | 'education' | 'certificate', number>, item: UserSkillResponse) => {
        if (item.lstExperiences) acc.experience += item.lstExperiences.length > 0 ? 1 : 0;
        if (item.lstProjects) acc.project += item.lstProjects.length > 0 ? 1 : 0;
        if (item.lstEducations) acc.education += item.lstEducations.length > 0 ? 1 : 0;
        if (item.lstCertificates) acc.certificate += item.lstCertificates.length > 0 ? 1 : 0;
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
        ? { title: 'Skill evidence by source', description: 'Number of skills connected to each portfolio evidence source.', customData, measure: 'count' as const, unit: 'items' as const }
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
        header: { title: 'Skills', icon: StarIcon, description: 'Capabilities connected to your portfolio work' },
        emptyState: { title: 'No skills added', description: 'Add skills and connect them to projects, experience, education, or certificates.' },
        bar: barData,
        matrix,
        list: [  { leftKey: 'skill.name', size: 'lg' } ],
        create: { title: 'Manage', subTitle: 'Manage skills', form: <UserSkillForm />, icon: ListTodo},
    }
}
