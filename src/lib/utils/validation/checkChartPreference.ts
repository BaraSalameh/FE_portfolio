import { UserChartPreferenceFormData } from "@/features/dashboard/profile/settings/chart-preferences/schema";
import { UserChartPreferenceKeys } from "@/features/dashboard/profile/settings/chart-preferences/types.chart-preferences";

export const checkChartPreferences = (list: UserChartPreferenceFormData[], keys: UserChartPreferenceKeys) => {
    const pref = list.find((cfg: any) => cfg.widget.name === keys.widget && cfg.chartType.name === keys.chartType);
    
    return pref;
}