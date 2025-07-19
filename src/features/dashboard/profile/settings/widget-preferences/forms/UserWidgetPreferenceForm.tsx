'use client';

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { useEffect, useMemo } from "react";
import { mapPreferenceToForm } from "@/lib/utils/appFunctions";
import { ControlledForm } from "@/components/ui/form";
import { PREFERENCES } from "@/lib/constants";
import { UserPreferenceProps } from "../types.widget-preferences";
import { UserWidgetPreferenceFormData, userWidgetPreferenceSchema } from "../schema";
import { editUserWidgetPreference, userWidgetPreferenceListQuery, widgetPreferenceListQuery } from "../apis";

export const UserWidgetPreferenceForm = ({id, onClose, preferenceKey, preferenceValues} : UserPreferenceProps) => {

    const dispatch = useAppDispatch();
    const { loading, error, lstUserPreferences, preference } = useAppSelector((state) => state.userWidgetPreference);
    const { lstPreferences } = preference;
    const indicator = {when: 'Update', while: 'Updating...'};

    const valueOptions = useMemo(() =>
        !preferenceValues || preferenceValues === 'toggle' ? PREFERENCES.VALUE.TOGGLE : preferenceValues
    , [preferenceValues]);

    const onSubmit = async (data: UserWidgetPreferenceFormData) => {
        const resultAction = await dispatch(editUserWidgetPreference(data));

        if (!editUserWidgetPreference.rejected.match(resultAction)) {
            await dispatch(userWidgetPreferenceListQuery());
            onClose?.();
        }
    };

    useEffect(() => {
        lstPreferences.length === 0 && dispatch(widgetPreferenceListQuery());
    }, []);

    const items = useMemo(() => [
        {as: 'Input', name: 'LKP_PreferenceID', type: 'hidden', config: ['Disabled']},
        {as: 'Dropdown', name: 'value', options: valueOptions, label: 'Value'}
    ], [valueOptions]);

    const resetItems = useMemo(
        () => mapPreferenceToForm(lstUserPreferences, preferenceKey, lstPreferences, valueOptions),
    [lstUserPreferences, preferenceKey, lstPreferences]);

    return (
        <ControlledForm
            schema={userWidgetPreferenceSchema}
            onSubmit={onSubmit}
            items={items as any}
            error={error}
            loading={loading}
            resetItems={resetItems as any}
            indicator={indicator}
        />
    );
}