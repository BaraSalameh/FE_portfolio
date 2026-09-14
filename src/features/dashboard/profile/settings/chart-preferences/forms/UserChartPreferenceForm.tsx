'use client';

import { useAppSelector } from "@/lib/store/hooks";
import { useMemo } from "react";
import { mapChartPreferenceToForm } from "@/lib/utils";
import { ControlledForm } from '@/features/dashboard/forms';
import { UserChartPreferenceProps } from "../types.chart-preferences";
import { userChartPreferenceSchema } from "../schema";
import { useHandleSubmit } from "../hooks";
import { FormItem } from '@/features/dashboard/forms/types.forms';

export const UserChartPreferenceForm = ({onClose, preferenceKeys, preferenceValues} : UserChartPreferenceProps) => {

    const { lstUserChartPreferences, widget, chartType } = useAppSelector((state) => state.userChartPreference);
    const { lstWidgets } = widget;
    const { lstChartTypes } = chartType;
    const indicator = {when: 'Update', while: 'Updating...'};

    const { onSubmit, isSaving, error, saved } = useHandleSubmit({ onClose });
    
    const resetItems = useMemo(
        () => mapChartPreferenceToForm(lstUserChartPreferences, preferenceKeys, lstWidgets, lstChartTypes, preferenceValues),
    [lstUserChartPreferences, preferenceKeys, lstWidgets, lstChartTypes, preferenceValues]);

    const items = useMemo<FormItem<typeof userChartPreferenceSchema>[]>(() => [
        {as: 'Input', name: 'LKP_WidgetID', type: 'hidden', config: ['Disabled']},
        {as: 'Input', name: 'LKP_ChartTypeID', type: 'hidden', config: ['Disabled']},
        {as: 'Dropdown', name: 'groupBy', options: preferenceValues.groupBy, label: 'Group by'},
        {as: 'Dropdown', name: 'valueSource', options: preferenceValues.valueSource, label: 'Value source'}
    ], [preferenceValues]);

    return (
        <ControlledForm
            schema={userChartPreferenceSchema}
            onSubmit={onSubmit}
            items={items}
            error={error}
            loading={isSaving}
            resetItems={resetItems}
            indicator={indicator}
        >
            {saved && <p role="status" className="text-sm font-semibold text-success">Chart preference saved.</p>}
        </ControlledForm>
    );
}
