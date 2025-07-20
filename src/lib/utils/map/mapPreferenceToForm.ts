import { UserWidgetPreferenceFormData } from "@/features/dashboard/profile/settings/widget-preferences/schema";
import { Option } from "@/features/types.features";

export const mapPreferenceToForm = (
    oldUserPreferences: any[],
    preferenceKey: string,
    preferences: any[],
    preferenceValue: Option[]
): UserWidgetPreferenceFormData => {
    const userOption = oldUserPreferences.find(item => item?.preference?.name === preferenceKey);
    const defaultOption = preferences.find(opt => opt.name === preferenceKey);
    const defaultValue = preferenceValue?.[0];

    return {
        LKP_PreferenceID: defaultOption?.id,
        value: userOption?.value ?? defaultValue?.value
    };
}