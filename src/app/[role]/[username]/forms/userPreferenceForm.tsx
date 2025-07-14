'use client';

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { userPreferenceSchema, UserPreferenceFormData } from "@/lib/schemas";
import { useEffect, useMemo } from "react";
import { mapPreferenceToForm, OptionsCreator } from "@/lib/utils/appFunctions";
import { UserPreferenceProps } from "../types";
import { ControlledForm } from "@/components/ui/form";
import { userPreferenceListQuery } from "@/lib/apis/owner/userPreference/userPreferenceListQuery";
import { editUserPreference } from "@/lib/apis/owner/userPreference/editUserPreference";
import { preferenceListQuery } from "@/lib/apis/owner/userPreference/preferenceListQuery";
import { PREFERENCES } from "@/lib/constants";

const UserPreferenceForm = ({id, onClose, preferenceKey, preferenceValues} : UserPreferenceProps) => {

    const dispatch = useAppDispatch();
    const { loading, error, lstUserPreferences, preference } = useAppSelector((state) => state.userPreference);
    const { lstPreferences } = preference;
    const indicator = {when: 'Update', while: 'Updating...'};

    const valueOptions = useMemo(() =>
        !preferenceValues || preferenceValues === 'toggle' ? PREFERENCES.VALUE.TOGGLE : preferenceValues
    , [preferenceValues]);

    const onSubmit = async (data: UserPreferenceFormData) => {
        const resultAction = await dispatch(editUserPreference(data));

        if (!editUserPreference.rejected.match(resultAction)) {
            await dispatch(userPreferenceListQuery());
            onClose?.();
        }
    };

    useEffect(() => {
        lstPreferences.length === 0 && dispatch(preferenceListQuery());
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
            schema={userPreferenceSchema}
            onSubmit={onSubmit}
            items={items as any}
            error={error}
            loading={loading}
            resetItems={resetItems as any}
            indicator={indicator}
        />
    );
}

export default UserPreferenceForm;