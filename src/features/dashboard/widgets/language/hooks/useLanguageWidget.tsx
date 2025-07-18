import { CahrtEntry, WidgetCardProps } from "@/components/ui/widget/types";
import { useAppSelector } from "@/lib/store/hooks";
import { BadgePercent, Languages, ListPlusIcon } from "lucide-react";
import { CheckPreferences } from "@/lib/utils/appFunctions";
import { PREFERENCES } from "@/lib/constants";
import { UserLanguageForm } from "../forms";

export const useLanguageWidget = (): WidgetCardProps => {

    const { loading: languageLoading, lstUserLanguages } = useAppSelector(state => state.userLanguage);
    const { lstUserPreferences } = useAppSelector(state => state.userWidgetPreference);
    
    const levelMap: Record<string, number> = {
        native: 100,
        advanced: 80,
        intermediate: 60,
        beginner: 40,
        basic: 20
    };

    const customBarData = (lstUserLanguages as any).map((item: any): CahrtEntry => ({
        name: item.language.name,
        value: levelMap[item.languageProficiency.level.toLowerCase()] ?? 0
    }));

    const barData = CheckPreferences(lstUserPreferences, PREFERENCES.KEY.SHOW_LANGUAGE_BAR_CHART)
    ?   { title: 'Language proficiency overview (100%)', customData: customBarData }
    :   {};

    const pieData = CheckPreferences(lstUserPreferences, PREFERENCES.KEY.SHOW_LANGUAGE_PIE_CHART)
    ?   { title: 'Language overview', customData: customBarData }
    :   {};

    const radarData = CheckPreferences(lstUserPreferences, PREFERENCES.KEY.SHOW_LANGUAGE_RADAR_CHART)
    ?   { title: 'proficiency overview', customData: customBarData }
    :   {};

    return {
        isLoading: languageLoading,
        items: lstUserLanguages,
        header: { title: 'Language', icon: Languages },
        pie: pieData,
        bar: barData,
        radar: radarData,
        list: [
            { leftKey: 'language.name', size: 'lg' },
            { leftKey: 'languageProficiency.level', icon: BadgePercent }
        ],
        create: { subTitle: 'Modify Languages', form: <UserLanguageForm />, icon: ListPlusIcon},
    }
}