import { CahrtEntry, WidgetCardProps } from "@/components/widgets/types.widgets";
import { useAppSelector } from "@/lib/store/hooks";
import { BadgePercent, Languages, ListPlusIcon } from "lucide-react";
import { checkWidgetPreferences } from "@/lib/utils";
import { widget_preferences } from "@/lib/utils";
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

    const barData = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_language_bar_chart)
    ?   { title: 'Language proficiency overview (100%)', customData: customBarData }
    :   {};

    const pieData = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_language_pie_chart)
    ?   { title: 'Language overview', customData: customBarData }
    :   {};

    const radarData = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_language_radar_chart)
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