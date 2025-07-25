import { WidgetCardProps } from "@/components/widgets/types.widgets";
import { widget_preferences } from "@/lib/utils";
import { useAppSelector } from "@/lib/store/hooks";
import { checkWidgetPreferences } from "@/lib/utils";
import { BarChart3 } from "lucide-react";

export const useOverviewWidget = (): WidgetCardProps => {

    const { lstEducations } = useAppSelector(state => state.education);
    const { lstUserPreferences } = useAppSelector(state => state.userWidgetPreference);
    const { lstProjectTechnologies } = useAppSelector(state => state.projectTechnology);
    const { lstUserLanguages } = useAppSelector(state => state.userLanguage);
    const { lstExperiences } = useAppSelector(state => state.experience);
    const { lstUserSkills } = useAppSelector(state => state.userSkill);

    const customData = [
        {name: 'Education', value: lstEducations.length},
        {name: 'Language', value: lstUserLanguages.length},
        {name: 'Experience', value: lstExperiences.length}
    ]

    const projectData =  {name: 'Project', value: lstProjectTechnologies.length};
    const skillData = {name: 'Skills', value: lstUserSkills.length};

    const showProjectWidget = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_project_widget);
    const showSkillWidget = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_skill_widget);
    if (showProjectWidget) {
        customData.push(projectData);
    }

    if (showSkillWidget) {
        customData.push(skillData);
    }

    const barData = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_overview_bar_chart)
    ?   { title: '', customData: customData}
    :   {};

    const pieData = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_overview_pie_chart)
    ?   { title: '', customData: customData}
    :   {};

    const radarData = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_overview_radar_chart)
    ?   { title: '', customData: customData}
    :   {};

    return {
        header: { title: 'Overview', icon:  BarChart3},
        items: [{}],
        bar: barData,
        pie: pieData,
        radar: radarData,
    }
}