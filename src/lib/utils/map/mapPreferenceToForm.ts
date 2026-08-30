import { UserWidgetPreferenceFormData } from "@/features/dashboard/profile/settings/widget-preferences/schema";
import { Option } from "@/features/types.features";
import { UserWidgetPreferenceResponse } from "@/features/dashboard/profile/settings/widget-preferences/types.widget-preferences";
import { WidgetPreferenceFormData } from "@/features/dashboard/profile/settings/widget-preferences/schema";

export const mapPreferenceToForm = (
    oldUserPreferences: UserWidgetPreferenceResponse[],
    preferenceKey: string,
    preferences: WidgetPreferenceFormData[],
    preferenceValue: Option[]
): UserWidgetPreferenceFormData => {
    const userOption = oldUserPreferences.find(item => item?.preference?.name === preferenceKey);
    const defaultOption = preferences.find(opt => opt.name === preferenceKey);
    const defaultValue = preferenceValue?.[0];

    return {
        LKP_PreferenceID: defaultOption?.id ?? '',
        value: userOption?.value ?? defaultValue?.value
    };
}
