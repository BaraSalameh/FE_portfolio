import { CahrtEntry, WidgetCardProps } from "@/components/widgets/types.widgets";
import { useAppSelector } from "@/lib/store/hooks";
import { ListPlusIcon, StarIcon } from "lucide-react";
import { UserSkillForm } from "../forms";
import { checkWidgetPreferences, widget_preferences } from "@/lib/utils";

export const useSkillWidget = (): WidgetCardProps => {

    const { loading, lstUserSkills } = useAppSelector(state => state.userSkill);
    const { lstUserPreferences } = useAppSelector(state => state.userWidgetPreference);

    const customData = (lstUserSkills as any).map((item: any): CahrtEntry => ({
        name: item.skill.name,
        value: item.proficiency
    }));

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
        items: lstUserSkills,
        header: { title: 'Skills', icon: StarIcon },
        bar: barData,
        pie: pieData,
        radar: radarData,
        list: [
            { leftKey: 'skill.name', size: 'lg' },
            { leftKey: 'proficiency', icon: StarIcon }
        ],
        details: [
            { leftKey: 'skill.skillCategory.name', between: '-', rightKey: 'skill.name', size: 'lg' },
            { leftKey: 'proficiency', icon: StarIcon },
            { leftKey: 'description', size: 'sm' }
        ],
        create: { subTitle: 'Modify Skills', form: <UserSkillForm />, icon: ListPlusIcon},
    }
}