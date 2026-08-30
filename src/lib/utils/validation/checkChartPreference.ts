import { UserChartPreferenceKeys, UserChartPreferenceResponse } from "@/features/dashboard/profile/settings/chart-preferences/types.chart-preferences";

export const checkChartPreferences = (list: UserChartPreferenceResponse[], keys: UserChartPreferenceKeys) => {
    const pref = list.find((cfg) => cfg.widget.name === keys.widget && cfg.chartType.name === keys.chartType);
    
    return pref;
}
