import { CahrtEntry, WidgetCardProps } from "@/components/widgets/types.widgets";
import { useAppSelector } from "@/lib/store/hooks";
import { ListPlusIcon, StarIcon } from "lucide-react";
import { UserSkillForm } from "../forms";

export const useSkillWidget = (): WidgetCardProps => {

    const { loading, lstUserSkills } = useAppSelector(state => state.userSkill);


    const customData = (lstUserSkills as any).map((item: any): CahrtEntry => ({
        name: item.skill.name,
        value: item.proficiency
    }));

    return {
        isLoading: loading,
        items: lstUserSkills,
        header: { title: 'Skill', icon: StarIcon },
        pie: { title: 'Skill overview', customData: customData },
        bar: { title: 'Skill overview', customData: customData },
        radar: { title: 'Skill overview', customData: customData },
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