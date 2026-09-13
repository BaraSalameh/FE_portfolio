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

    const barData = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_skill_bar_chart)
    ?   { title: 'Skill overview', customData: customData }
    :   {};

    const pieData = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_skill_pie_chart)
    ?   { title: 'Skill overview', customData: customData }
    :   {};

    const radarData = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_skill_radar_chart)
    ?   { title: 'Skill overview', customData: customData }
    :   {};

    return {
        isLoading: loading,
        error,
        items: lstUserSkills,
        header: { title: 'Skills', icon: StarIcon, description: 'Capabilities connected to your portfolio work' },
        emptyState: { title: 'No skills added', description: 'Add skills and connect them to projects, experience, education, or certificates.' },
        bar: barData,
        pie: pieData,
        radar: radarData,
        list: [  { leftKey: 'skill.name', size: 'lg' } ],
        create: { title: 'Manage', subTitle: 'Manage skills', form: <UserSkillForm />, icon: ListTodo},
    }
}
