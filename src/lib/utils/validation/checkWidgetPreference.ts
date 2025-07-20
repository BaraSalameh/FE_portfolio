import { UserWidgetPreferenceFormData } from "@/features/dashboard/profile/settings/widget-preferences/schema";
import { widget_preferences } from "@/lib/utils";

export const checkWidgetPreferences = (list: UserWidgetPreferenceFormData[], key: string, flag: string = widget_preferences.value.toggle[0].value) => {
    const pref = list.find((cfg: any) => cfg.preference.name === key);
    
    return !pref ? true : flag ? pref?.value === flag : pref.value;
}