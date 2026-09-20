import { ChartEntry, WidgetCardProps } from '@/features/dashboard/types.presentation';
import { useAppSelector } from "@/lib/store/hooks";
import { BadgePercent, Languages, ListTodo } from "lucide-react";
import { checkWidgetPreferences } from "@/lib/utils";
import { widget_preferences } from "@/lib/utils";
import { UserLanguageForm } from "../forms";
import { proficiencyToPercent } from '@/features/dashboard/presentation/widgets/entryPresentation';

export const useLanguageWidget = (): WidgetCardProps => {

    const { loading: languageLoading, error, lstUserLanguages } = useAppSelector(state => state.userLanguage);
    const { lstUserPreferences } = useAppSelector(state => state.userWidgetPreference);
    
    const customBarData = lstUserLanguages.map((item): ChartEntry => ({
        name: item.language.name,
        value: proficiencyToPercent(item.languageProficiency.level)
    }));

    const showBars = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_language_bar_chart);
    const barData = showBars
    ?   { title: 'Language proficiency', description: 'Self-reported proficiency on a shared 0–100 scale.', customData: customBarData, measure: 'proficiency' as const, unit: 'percent' as const }
    :   undefined;

    const radarData = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_language_radar_chart)
    ?   { title: 'Language proficiency profile', description: 'A normalized comparison across languages.', customData: customBarData, measure: 'proficiency' as const, unit: 'percent' as const }
    :   undefined;

    return {
        isLoading: languageLoading,
        error,
        items: lstUserLanguages,
        entryPresentation: { variant: 'language', singularLabel: 'Language' },
        header: { title: 'Languages', icon: Languages, description: 'Languages and current proficiency levels' },
        emptyState: { title: 'No languages added', description: 'Add the languages you use and your proficiency in each one.' },
        bar: barData,
        radar: radarData,
        list: [
            { leftKey: 'language.name', size: 'lg' },
            { leftKey: 'languageProficiency.level', icon: BadgePercent }
        ],
        create: { title: 'Manage', subTitle: 'Manage languages', form: <UserLanguageForm />, icon: ListTodo},
    }
}
