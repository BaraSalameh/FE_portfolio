import { UserWidgetPreferenceResponse } from "@/features/dashboard/profile/settings/widget-preferences/types.widget-preferences";
import { widget_preferences } from "@/lib/utils";

export const checkWidgetPreferences = (list: UserWidgetPreferenceResponse[], key: string, flag: string = widget_preferences.value.toggle[0].value, defaultValue = true) => {
    const pref = list.find((cfg) => cfg.preference.name === key);
    
    if (!pref) return defaultValue;
    if (!flag) return pref.value;
    if (flag === widget_preferences.value.toggle[0].value) {
        return pref.value === flag || pref.value.toLowerCase() === 'true';
    }
    return pref.value === flag;
}
