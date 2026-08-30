import { UserWidgetPreferenceResponse } from "@/features/dashboard/profile/settings/widget-preferences/types.widget-preferences";
import { widget_preferences } from "@/lib/utils";

export const checkWidgetPreferences = (list: UserWidgetPreferenceResponse[], key: string, flag: string = widget_preferences.value.toggle[0].value) => {
    const pref = list.find((cfg) => cfg.preference.name === key);
    
    return !pref ? true : flag ? pref?.value === flag : pref.value;
}
