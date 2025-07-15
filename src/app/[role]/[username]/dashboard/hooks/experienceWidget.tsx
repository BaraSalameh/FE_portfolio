import { WidgetCardProps } from "@/components/ui/widget/types";
import { useAppSelector } from "@/lib/store/hooks";
import { Briefcase, Clock, LocationEdit } from "lucide-react";
import { useDebouncedSortExperience, useHandleExperienceDelete } from "../handlers";
import ExperienceForm from "../../forms/experienceForm";
import { CheckPreferences } from "@/lib/utils/appFunctions";
import { PREFERENCES } from "@/lib/constants";

export const useExperienceWidget = (): WidgetCardProps => {

    const { loading: experienceLoading, lstExperiences } = useAppSelector(state => state.experience);
    const handleExperienceDelete = useHandleExperienceDelete();
    const debouncedSortExperience = useDebouncedSortExperience();

    const barData = CheckPreferences(PREFERENCES.KEY.SHOW_EXPERIENCE_BAR_CHART)
    ?   { groupBy: 'jobTitle' }
    :   {};

    const pieData = CheckPreferences(PREFERENCES.KEY.SHOW_EXPERIENCE_PIE_CHART)
    ?   { title: 'Experience Overview', groupBy: 'jobTitle' }
    :   {};

    const radarData = CheckPreferences(PREFERENCES.KEY.SHOW_EXPERIENCE_RADAR_CHART)
    ?   { title: 'Experience Duration Overview', groupBy: 'jobTitle' }
    :   {};
    
    return {
        isLoading: experienceLoading,
        items: lstExperiences,
        header: { title: 'Experience', icon: Briefcase },
        bar: barData,
        pie: pieData,
        radar: radarData,
        list: [
            { leftKey: 'jobTitle', between: 'at', rightKey: 'companyName', size: 'lg' },
            { leftKey: 'location', icon: LocationEdit },
            { leftKey: 'startDate', between: '-', rightKey: 'endDate', icon: Clock, isTime: true }
        ],
        create: { subTitle: 'Add Experience', form: <ExperienceForm /> },
        update: { subTitle: 'Update Experience', form: <ExperienceForm /> },
        del: { subTitle: 'Delete Experience', message: 'Are you sure?', onDelete: handleExperienceDelete },
        details: [
            { leftKey: 'jobTitle', between: 'at', rightKey: 'companyName', size: 'lg' },
            { leftKey: 'location', icon: LocationEdit },
            { leftKey: 'startDate', between: '-', rightKey: 'endDate', icon: Clock, isTime: true },
            { leftKey: 'description', size: 'sm' }
        ],
        onSort: debouncedSortExperience
    }
}