import { UserWidgetPreferenceFormData } from "@/features/dashboard/profile/settings/widget-preferences/schema";
import { Option } from "@/features/types.features";
import { UserWidgetPreferenceResponse } from "@/features/dashboard/profile/settings/widget-preferences/types.widget-preferences";
import { WidgetPreferenceFormData } from "@/features/dashboard/profile/settings/widget-preferences/schema";

export const mapPreferenceToForm = (
    oldUserPreferences: UserWidgetPreferenceResponse[],
    preferenceKey: string,
    preferences: WidgetPreferenceFormData[],
    preferenceValue: Option[],
    initialValue?: string,
): UserWidgetPreferenceFormData => {
    const userOption = oldUserPreferences.find(item => item?.preference?.name === preferenceKey);
    const defaultOption = preferences.find(opt => opt.name === preferenceKey);
    const defaultValue = preferenceValue?.[0];

    const storedValue = userOption?.value.toLowerCase();
    const normalizedValue = storedValue === 'true' ? 'show' : storedValue === 'false' ? 'hide' : userOption?.value;
    const validInitialValue = preferenceValue.some((option) => option.value === initialValue) ? initialValue : undefined;
    const selectedValue = preferenceValue.some((option) => option.value === normalizedValue)
        ? normalizedValue
        : validInitialValue ?? defaultValue?.value;

    return {
        LKP_PreferenceID: defaultOption?.id ?? '',
        value: selectedValue ?? ''
    };
}
