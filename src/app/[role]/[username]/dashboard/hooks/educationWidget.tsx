import { WidgetCardProps } from "@/components/ui/widget/types";
import { useAppSelector } from "@/lib/store/hooks";
import { Clock, GraduationCap } from "lucide-react";
import { useDebouncedSortEducation, useHandleEducationDelete } from "../handlers";
import EducationForm from "../../forms/educationForm";
import { CheckPreferences } from "@/lib/utils/appFunctions";
import { PREFERENCES } from "@/lib/constants";

export const useEducationWidget = (): WidgetCardProps => {

    const { loading: educationLoading, lstEducations } = useAppSelector(state => state.education);
    const handleEducationDelete = useHandleEducationDelete();
    const debouncedSortEducation = useDebouncedSortEducation();

    const barData = CheckPreferences(PREFERENCES.KEY.SHOW_EDUCATION_BAR_CHART)
    ?   { groupBy: 'degree.abbreviation'}
    :   {};

    const pieData = CheckPreferences(PREFERENCES.KEY.SHOW_EDUCATION_PIE_CHART)
    ?   { title: 'Degrees Overview', groupBy: 'degree.abbreviation' }
    :   {};

    const radarData = CheckPreferences(PREFERENCES.KEY.SHOW_EDUCATION_RADAR_CHART)
    ?   { title: 'Degrees Duration Overview', groupBy: 'degree.abbreviation'}
    :   {};
    
    return {
        isLoading: educationLoading,
        items: lstEducations,
        header: { title: 'Education', icon: GraduationCap },
        bar: barData,
        pie: pieData,
        radar: radarData,
        list: [
            { leftKey: 'degree.abbreviation', between: 'at', rightKey: 'institution.name', size: 'lg' },
            { leftKey: 'fieldOfStudy.name', icon: GraduationCap },
            { leftKey: 'startDate', between: '-', rightKey: 'endDate', icon: Clock, isTime: true }
        ],
        create: { subTitle: 'Add Education', form: <EducationForm /> },
        update: { subTitle: 'Update Education', form: <EducationForm /> },
        del: { subTitle: 'Delete education', message: 'Are you sure?', onDelete: handleEducationDelete },
        details: [
            { leftKey: 'degree.name', between: 'at', rightKey: 'institutionname', size: 'lg' },
            { leftKey: 'fieldOfStudy.name', icon: GraduationCap },
            { leftKey: 'startDate', between: '-', rightKey: 'endDate', icon: Clock, isTime: true },
            { leftKey: 'description', size: 'sm' }
        ],
        onSort: debouncedSortEducation
    }
}