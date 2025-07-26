import { CahrtEntry, WidgetCardProps } from "@/components/widgets/types.widgets";
import { useAppSelector } from "@/lib/store/hooks";
import { ListPlusIcon, StarIcon } from "lucide-react";
import { UserSkillForm } from "../forms";
import { checkWidgetPreferences, widget_preferences } from "@/lib/utils";

export const useSkillWidget = (): WidgetCardProps => {

    const { loading, lstUserSkills } = useAppSelector(state => state.userSkill);
    const { lstUserPreferences } = useAppSelector(state => state.userWidgetPreference);

    const counts = (lstUserSkills as any).reduce((acc: any, item: any) => {
        if (item.experience) acc.experience += 1;
        if (item.project) acc.project += 1;
        if (item.education) acc.education += 1;
        if (item.certificate) acc.certificate += 1;
        return acc;
    }, {
        experience: 0,
        project: 0,
        education: 0,
        certificate: 0
    });

    const customData: CahrtEntry[] = Object.entries(counts as Record<string, number>).map(
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
        items: lstUserSkills,
        header: { title: 'Skills', icon: StarIcon },
        bar: barData,
        pie: pieData,
        radar: radarData,
        list: [  { leftKey: 'skill.name', size: 'lg' } ],
        create: { subTitle: 'Modify Skills', form: <UserSkillForm />, icon: ListPlusIcon},
    }
}