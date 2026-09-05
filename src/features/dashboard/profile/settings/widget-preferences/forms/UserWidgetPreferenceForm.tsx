'use client';

import { useAppSelector } from "@/lib/store/hooks";
import { useMemo, useState } from "react";
import { mapPreferenceToForm } from "@/lib/utils";
import { ControlledForm } from '@/features/dashboard/forms';
import { widget_preferences } from "@/lib/utils";
import { UserPreferenceProps } from "../types.widget-preferences";
import { userWidgetPreferenceSchema } from "../schema";
import { useHandleSubmit } from "../hooks";
import { FormItem } from '@/features/dashboard/forms/types.forms';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';

export const UserWidgetPreferenceForm = ({ onClose, preferenceKey, preferenceValues, compact = false } : UserPreferenceProps) => {

    const { lstUserPreferences, preference } = useAppSelector((state) => state.userWidgetPreference);
    const { lstPreferences, loading: isPreferenceLoading } = preference;
    const [pendingValue, setPendingValue] = useState<string | null>(null);
    const indicator = {when: 'Update', while: 'Updating...'};
    
    const valueOptions = useMemo(() =>
        !preferenceValues || preferenceValues === 'toggle' ? widget_preferences.value.toggle : preferenceValues
    , [preferenceValues]);

    const { onSubmit, isSaving, error, saved } = useHandleSubmit({ onClose });
    const resetItems = useMemo(
        () => mapPreferenceToForm(lstUserPreferences, preferenceKey, lstPreferences, valueOptions),
    [lstUserPreferences, preferenceKey, lstPreferences, valueOptions]);

    const items = useMemo<FormItem<typeof userWidgetPreferenceSchema>[]>(() => [
        {as: 'Input', name: 'LKP_PreferenceID', type: 'hidden', config: ['Disabled']},
        {as: 'Dropdown', name: 'value', options: valueOptions, label: 'Value'}
    ], [valueOptions]);

    const isToggle = !preferenceValues || preferenceValues === 'toggle';
    const displayedValue = pendingValue ?? resetItems.value;
    const isVisible = displayedValue === widget_preferences.value.toggle[0].value;
    const isDisabled = isSaving || isPreferenceLoading || !resetItems.LKP_PreferenceID;
    const preferenceName = preferenceKey.replace(/^show-/, '').replaceAll('-', ' ');
    const toggleLabel = `${isVisible ? 'Hide' : 'Show'} ${preferenceName}`;

    const handleToggle = async () => {
        if (isDisabled) return;

        const nextValue = isVisible
            ? widget_preferences.value.toggle[1].value
            : widget_preferences.value.toggle[0].value;
        setPendingValue(nextValue);
        try {
            await onSubmit({ ...resetItems, value: nextValue });
        } finally {
            setPendingValue(null);
        }
    };

    if (isToggle) {
        return (
            <div className={compact ? 'flex shrink-0 flex-col items-end gap-2' : 'space-y-2'}>
                <div className={compact ? undefined : 'flex items-center justify-between gap-4 rounded-xl bg-canvas-subtle p-3'}>
                    {!compact && <span className="text-sm font-semibold text-ink">{isVisible ? 'Shown' : 'Hidden'}</span>}
                    <button
                        type="button"
                        role="switch"
                        aria-checked={isVisible}
                        aria-label={toggleLabel}
                        title={toggleLabel}
                        disabled={isDisabled}
                        onClick={handleToggle}
                        className={`grid size-10 place-items-center rounded-full border shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:opacity-60 ${isVisible ? 'border-accent/30 bg-accent text-white hover:bg-accent-strong' : 'border-line bg-surface text-ink-muted hover:bg-surface-raised hover:text-ink'}`}
                    >
                        {isSaving
                            ? <LoaderCircle className="size-[1.05rem] animate-spin" aria-hidden="true" />
                            : isVisible
                                ? <Eye className="size-[1.05rem]" aria-hidden="true" />
                                : <EyeOff className="size-[1.05rem]" aria-hidden="true" />}
                    </button>
                </div>
                {saved ? <p role="status" className="text-sm font-semibold text-success">Preference saved.</p> : null}
                {Array.isArray(error)
                    ? <ul role="alert" className="list-disc space-y-1 pl-5 text-sm text-danger">{error.map((message) => <li key={message}>{message}</li>)}</ul>
                    : error ? <p role="alert" className="text-sm text-danger">{error}</p> : null}
            </div>
        );
    }

    return (
        <ControlledForm
            schema={userWidgetPreferenceSchema}
            onSubmit={onSubmit}
            items={items}
            error={error}
            loading={isSaving}
            resetItems={resetItems}
            indicator={indicator}
        >
            {saved && <p role="status" className="text-sm font-semibold text-success">Preference saved.</p>}
        </ControlledForm>
    );
}
