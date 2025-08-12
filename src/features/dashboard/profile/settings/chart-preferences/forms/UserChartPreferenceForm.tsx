'use client';

import { useAppSelector } from "@/lib/store/hooks";
import { useMemo } from "react";
import { mapChartPreferenceToForm } from "@/lib/utils";
import { ControlledForm } from "@/components/forms";
import { UserChartPreferenceProps } from "../types.chart-preferences";
import { userChartPreferenceSchema } from "../schema";
import { useHandleSubmit, useLoadChartType, useLoadWidget } from "../hooks";

export const UserChartPreferenceForm = ({id, onClose, preferenceKeys, preferenceValues} : UserChartPreferenceProps) => {

    const { loading, error, lstUserChartPreferences, widget, chartType } = useAppSelector((state) => state.userChartPreference);
    const { lstWidgets } = widget;
    const { lstChartTypes } = chartType;
    const indicator = {when: 'Update', while: 'Updating...'};

    useLoadWidget();
    useLoadChartType();
    const onSubmit = useHandleSubmit({ onClose });
    
    const resetItems = useMemo(
        () => mapChartPreferenceToForm(lstUserChartPreferences, preferenceKeys, lstWidgets, lstChartTypes, preferenceValues),
    [lstUserChartPreferences, preferenceKeys, lstWidgets, lstChartTypes]);

    const items = useMemo(() => [
        {as: 'Input', name: 'LKP_WidgetID', type: 'hidden', config: ['Disabled']},
        {as: 'Input', name: 'LKP_ChartTypeID', type: 'hidden', config: ['Disabled']},
        {as: 'Dropdown', name: 'groupBy', options: preferenceValues.groupBy, label: 'Group by'},
        {as: 'Dropdown', name: 'valueSource', options: preferenceValues.valueSource, label: 'Value source'}
    ], [preferenceValues]);

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