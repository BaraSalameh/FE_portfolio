import { WidgetCardProps } from "@/components/ui/widget/types";
import { PREFERENCES } from "@/lib/constants";
import { useAppSelector } from "@/lib/store/hooks";
import { CheckPreferences } from "@/lib/utils/appFunctions";
import { BarChart3 } from "lucide-react";

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

    const barData = CheckPreferences(PREFERENCES.KEY.SHOW_OVERVIEW_BAR_CHART)
    ?   { title: '', customData: customData}
    :   {};

    const pieData = CheckPreferences(PREFERENCES.KEY.SHOW_OVERVIEW_PIE_CHART)
    ?   { title: '',customData: customData}
    :   {};

    const radarData = CheckPreferences(PREFERENCES.KEY.SHOW_OVERVIEW_RADAR_CHART)
    ?   { title: '',customData: customData}
    :   {};

    return {
        header: { title: 'Overview', icon:  BarChart3},
        items: [{}],
        bar: barData,
        pie: pieData,
        radar: radarData,
    }
}