'use client';

import { useAppSelector } from "@/lib/store/hooks";
import { useMemo } from "react";
import { mapPreferenceToForm } from "@/lib/utils";
import { ControlledForm } from "@/components/forms";
import { widget_preferences } from "@/lib/utils";
import { UserPreferenceProps } from "../types.widget-preferences";
import { userWidgetPreferenceSchema } from "../schema";
import { useHandleSubmit, useLoadWidgetPreference } from "../hooks";
import { FormItem } from "@/components/forms/types.forms";

export const UserWidgetPreferenceForm = ({ onClose, preferenceKey, preferenceValues } : UserPreferenceProps) => {

    const { loading, error, lstUserPreferences, preference } = useAppSelector((state) => state.userWidgetPreference);
    const { lstPreferences } = preference;
    const indicator = {when: 'Update', while: 'Updating...'};
    
    useLoadWidgetPreference();

    const valueOptions = useMemo(() =>
        !preferenceValues || preferenceValues === 'toggle' ? widget_preferences.value.toggle : preferenceValues
    , [preferenceValues]);

    const onSubmit = useHandleSubmit({ onClose });
    const resetItems = useMemo(
        () => mapPreferenceToForm(lstUserPreferences, preferenceKey, lstPreferences, valueOptions),
    [lstUserPreferences, preferenceKey, lstPreferences, valueOptions]);

    const items = useMemo<FormItem<typeof userWidgetPreferenceSchema>[]>(() => [
        {as: 'Input', name: 'LKP_PreferenceID', type: 'hidden', config: ['Disabled']},
        {as: 'Dropdown', name: 'value', options: valueOptions, label: 'Value'}
    ], [valueOptions]);

    return (
        <ControlledForm
            schema={userWidgetPreferenceSchema}
            onSubmit={onSubmit}
            items={items}
            error={error}
            loading={loading}
            resetItems={resetItems}
            indicator={indicator}
        />
    );
}
