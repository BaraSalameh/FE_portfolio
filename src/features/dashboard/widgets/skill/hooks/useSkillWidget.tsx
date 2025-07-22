import { WidgetCardProps } from "@/components/widgets/types.widgets";
import { useAppSelector } from "@/lib/store/hooks";
import { BadgePercent, ListPlusIcon, StarIcon } from "lucide-react";
import { SkillForm } from "../forms";

export const useSkillWidget = (): WidgetCardProps => {

    const { loading, lstSkills } = useAppSelector(state => state.skill);

    return {
        isLoading: loading,
        items: lstSkills,
        header: { title: 'Skill', icon: StarIcon },
        pie: { title: 'Skill overview', groupBy: 'skill.name' },
        bar: { title: 'Skill overview', groupBy: 'skill.name' },
        radar: { title: 'Skill overview', groupBy: 'skill.name' },
        list: [
            { leftKey: 'skill.name', size: 'lg' },
            { leftKey: 'skill.proficiency', icon: BadgePercent }
        ],
        create: { subTitle: 'Modify Skills', form: <SkillForm />, icon: ListPlusIcon},
    }
}