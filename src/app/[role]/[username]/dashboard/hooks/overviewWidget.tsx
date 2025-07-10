import { WidgetCardProps } from "@/components/ui/widget/types";
import { useAppSelector } from "@/lib/store/hooks";

export const useOverviewWidget = (): WidgetCardProps => {

    const { lstEducations } = useAppSelector(state => state.education);
    const { lstProjectTechnologies } = useAppSelector(state => state.projectTechnology);
    const { lstUserLanguages } = useAppSelector(state => state.userLanguage);
    const { lstExperiences } = useAppSelector(state => state.experience);

    const customData = [
        {name: 'Education', value: lstEducations.length},
        {name: 'Project', value: lstProjectTechnologies.length},
        {name: 'Language', value: lstUserLanguages.length},
        {name: 'Experience', value: lstExperiences.length},
    ]

    return {
        items: [{}],
        bar: { title: 'Total (overview)', customData: customData},
    }
}