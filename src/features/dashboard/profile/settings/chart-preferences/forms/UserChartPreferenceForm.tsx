'use client';

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { useEffect, useMemo } from "react";
import { mapChartPreferenceToForm } from "@/lib/utils/appFunctions";
import { ControlledForm } from "@/components/ui/form";
import { UserChartPreferenceProps } from "../types";
import { UserChartPreferenceFormData, userChartPreferenceSchema } from "../schema";
import { chartTypeListQuery, editUserChartPreference, userChartPreferenceListQuery, widgetListQuery } from "../apis";

export const UserChartPreferenceForm = ({id, onClose, preferenceKeys, preferenceValues} : UserChartPreferenceProps) => {

    const dispatch = useAppDispatch();
    const { loading, error, lstUserChartPreferences, widget, chartType } = useAppSelector((state) => state.userChartPreference);
    const { lstWidgets } = widget;
    const { lstChartTypes } = chartType;
    const indicator = {when: 'Update', while: 'Updating...'};

    const onSubmit = async (data: UserChartPreferenceFormData) => {
        const resultAction = await dispatch(editUserChartPreference(data));

        if (!editUserChartPreference.rejected.match(resultAction)) {
            await dispatch(userChartPreferenceListQuery());
            onClose?.();
        }
    };

    useEffect(() => {
        lstWidgets.length === 0 && dispatch(widgetListQuery());
        lstChartTypes.length === 0 && dispatch(chartTypeListQuery());
    }, []);

    const items = useMemo(() => [
        {as: 'Input', name: 'LKP_WidgetID', type: 'hidden', config: ['Disabled']},
        {as: 'Input', name: 'LKP_ChartTypeID', type: 'hidden', config: ['Disabled']},
        {as: 'Dropdown', name: 'groupBy', options: preferenceValues.groupBy, label: 'Group by'},
        {as: 'Dropdown', name: 'valueSource', options: preferenceValues.valueSource, label: 'Value source'}
    ], [preferenceValues]);

    const resetItems = useMemo(
        () => mapChartPreferenceToForm(lstUserChartPreferences, preferenceKeys, lstWidgets, lstChartTypes, preferenceValues),
    [lstUserChartPreferences, preferenceKeys, lstWidgets, lstChartTypes]);

    return (
        <ControlledForm
            schema={userChartPreferenceSchema}
            onSubmit={onSubmit}
            items={items as any}
            error={error}
            loading={loading}
            resetItems={resetItems as any}
            indicator={indicator}
        />
    );
}