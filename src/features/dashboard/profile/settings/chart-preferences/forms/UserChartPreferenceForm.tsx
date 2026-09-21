'use client';

import { useAppSelector } from "@/lib/store/hooks";
import { useMemo } from "react";
import { mapChartPreferenceToForm } from "@/lib/utils";
import { ControlledForm } from '@/features/dashboard/forms';
import { UserChartPreferenceProps } from "../types.chart-preferences";
import { userChartPreferenceSchema } from "../schema";
import { useHandleSubmit } from "../hooks";
import { FormItem } from '@/features/dashboard/forms/types.forms';
import { Toast } from '@/design-system';

export const UserChartPreferenceForm = ({onClose, preferenceKeys, preferenceValues} : UserChartPreferenceProps) => {

    const { lstUserChartPreferences, widget, chartType } = useAppSelector((state) => state.userChartPreference);
    const { lstWidgets } = widget;
    const { lstChartTypes } = chartType;
    const indicator = {when: 'Update', while: 'Updating...'};
    const hasFixedValues = preferenceValues.groupBy.length === 1 || preferenceValues.valueSource.length === 1;

    const { onSubmit, isSaving, error, saved } = useHandleSubmit({ onClose });
    
    const resetItems = useMemo(
        () => mapChartPreferenceToForm(lstUserChartPreferences, preferenceKeys, lstWidgets, lstChartTypes, preferenceValues),
    [lstUserChartPreferences, preferenceKeys, lstWidgets, lstChartTypes, preferenceValues]);

    const items = useMemo<FormItem<typeof userChartPreferenceSchema>[]>(() => [
        {as: 'Input', name: 'LKP_WidgetID', type: 'hidden', config: ['Disabled']},
        {as: 'Input', name: 'LKP_ChartTypeID', type: 'hidden', config: ['Disabled']},
        preferenceValues.groupBy.length > 1
            ? {as: 'Dropdown', name: 'groupBy', options: preferenceValues.groupBy, label: 'Group by'}
            : {as: 'Input', name: 'groupBy', type: 'hidden'},
        preferenceValues.valueSource.length > 1
            ? {as: 'Dropdown', name: 'valueSource', options: preferenceValues.valueSource, label: 'Value source'}
            : {as: 'Input', name: 'valueSource', type: 'hidden'}
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
            {hasFixedValues ? (
                <div className="rounded-xl bg-canvas-subtle px-3.5 py-3 text-sm text-ink-muted">
                    {preferenceValues.groupBy.length === 1
                        ? <p><span className="font-semibold text-ink">Grouping:</span> {preferenceValues.groupBy[0].label}</p>
                        : null}
                    {preferenceValues.valueSource.length === 1
                        ? <p><span className="font-semibold text-ink">Value:</span> {preferenceValues.valueSource[0].label}</p>
                        : null}
                </div>
            ) : null}
            {saved ? <Toast message="Chart preference saved." onDismiss={() => undefined} /> : null}
        </ControlledForm>
    );
}
