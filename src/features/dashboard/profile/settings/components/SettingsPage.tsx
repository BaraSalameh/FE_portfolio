"use client";

import React, { useTransition } from 'react';
import { ActionDialog as CUDModal, Disclosure as ContentContainer, ThemeSwitch } from '@/design-system';
import { BarChart, Calendar, Component, LogOut, Mail, Mars, Phone, PieChart, Radar, SunMoonIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/store/hooks';
import { UserWidgetPreferenceForm } from '../widget-preferences/forms/UserWidgetPreferenceForm';
import { UserChartPreferenceForm } from '../chart-preferences/forms/UserChartPreferenceForm';
import { chart_preferences, checkWidgetPreferences, useUrlParams, widget_preferences } from '@/lib/utils';
import { paths } from '@/lib/pathHelper';

export const SettingsPage = () => {

    const router = useRouter();
    const {role, username} = useUrlParams();
    const { lstUserPreferences } = useAppSelector(state => state.userWidgetPreference);
    const [isLoggingOut, startLogout] = useTransition();

    const handleLogout = () => startLogout(async () => {
        try {
            await fetch('/api/Account/Logout', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: '{}',
            });
        } finally {
            // Ensure browser cookies are removed even if portfolio-api is down.
            await fetch(paths.root.auth.logout.path(), { method: 'POST' }).catch(() => undefined);
            router.replace(paths.root.auth.login.path());
            router.refresh();
        }
    });

    return (
        <React.Fragment>
            <ContentContainer title='Preferences' space='lg'>
                <CUDModal title='Change theme' icon={SunMoonIcon}>
                    <div className="flex items-center justify-between rounded-xl border border-line bg-canvas-subtle p-4">
                        <div><p className="text-sm font-bold">Appearance</p><p className="mt-1 text-xs text-ink-muted">Switch between light and dark mode.</p></div>
                        <ThemeSwitch />
                    </div>
                </CUDModal>
                <ContentContainer title='Profile'>
                    <CUDModal title='Show/Hide gender' icon={Mars}>
                        <UserWidgetPreferenceForm preferenceKey={widget_preferences.key.show_gender} />
                    </CUDModal>
                    <CUDModal title='Show/Hide birthdate' icon={Calendar}>
                        <UserWidgetPreferenceForm preferenceKey={widget_preferences.key.show_birthdate} />
                    </CUDModal>
                    <CUDModal title='Show/Hide email address' icon={Mail}>
                        <UserWidgetPreferenceForm preferenceKey={widget_preferences.key.show_email_address} />
                    </CUDModal>
                    <CUDModal title='Show/Hide phone number' icon={Phone}>
                        <UserWidgetPreferenceForm preferenceKey={widget_preferences.key.show_phone_number} />
                    </CUDModal>
                </ContentContainer>
                <ContentContainer title='Overview'>
                    <CUDModal title='Show/Hide widget' icon={Component}>
                        <UserWidgetPreferenceForm preferenceKey={widget_preferences.key.show_overview_widget} />
                    </CUDModal>
                    {checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_overview_widget) &&
                        <React.Fragment>
                            <CUDModal title='Show/Hide Bar chart' icon={BarChart}>
                                <UserWidgetPreferenceForm preferenceKey={widget_preferences.key.show_overview_bar_chart} />
                            </CUDModal>
                            <CUDModal title='Show/Hide Pie chart' icon={PieChart}>
                                <UserWidgetPreferenceForm preferenceKey={widget_preferences.key.show_overview_pie_chart} />
                            </CUDModal>
                            <CUDModal title='Show/Hide Radar chart' icon={Radar}>
                                <UserWidgetPreferenceForm preferenceKey={widget_preferences.key.show_overview_radar_chart} />
                            </CUDModal>
                        </React.Fragment>
                    }
                </ContentContainer>
                <ContentContainer title='Education'>
                    <CUDModal title='Show/Hide Bar chart' icon={BarChart}>
                        <UserWidgetPreferenceForm preferenceKey={widget_preferences.key.show_education_bar_chart} />
                    </CUDModal>
                    <CUDModal title='Show/Hide Pie chart' icon={PieChart}>
                        <UserWidgetPreferenceForm preferenceKey={widget_preferences.key.show_education_pie_chart} />
                    </CUDModal>
                    <CUDModal title='Show/Hide Radar chart' icon={Radar}>
                        <UserWidgetPreferenceForm preferenceKey={widget_preferences.key.show_education_radar_chart} />
                    </CUDModal>
                </ContentContainer>
                <ContentContainer title='Experience'>
                    <CUDModal title='Show/Hide Bar chart' icon={BarChart}>
                        <UserWidgetPreferenceForm preferenceKey={widget_preferences.key.show_experience_bar_chart} />
                    </CUDModal>
                    <CUDModal title='Show/Hide Pie chart' icon={PieChart}>
                        <UserWidgetPreferenceForm preferenceKey={widget_preferences.key.show_experience_pie_chart} />
                    </CUDModal>
                    <CUDModal title='Show/Hide Radar chart' icon={Radar}>
                        <UserWidgetPreferenceForm preferenceKey={widget_preferences.key.show_experience_radar_chart} />
                    </CUDModal>
                </ContentContainer>
                <ContentContainer title='Project'>
                    <CUDModal title='Show/Hide widget' icon={Component}>
                        <UserWidgetPreferenceForm preferenceKey={widget_preferences.key.show_project_widget} />
                    </CUDModal>
                    {checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_project_widget) &&
                        <React.Fragment>
                            <CUDModal title='Show/Hide Bar chart' icon={BarChart}>
                                <UserWidgetPreferenceForm preferenceKey={widget_preferences.key.show_project_bar_chart} />
                            </CUDModal>
                            <CUDModal title='Show/Hide Pie chart' icon={PieChart}>
                                <UserWidgetPreferenceForm preferenceKey={widget_preferences.key.show_project_pie_chart} />
                            </CUDModal>
                            <CUDModal title='Show/Hide Radar chart' icon={Radar}>
                                <UserWidgetPreferenceForm preferenceKey={widget_preferences.key.show_project_radar_chart} />
                            </CUDModal>
                        </React.Fragment>
                    }
                </ContentContainer>
                <ContentContainer title='Skill'>
                    <CUDModal title='Show/Hide widget' icon={Component}>
                        <UserWidgetPreferenceForm preferenceKey={widget_preferences.key.show_skill_widget} />
                    </CUDModal>
                    {checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_skill_widget) &&
                        <React.Fragment>
                            <CUDModal title='Show/Hide Bar chart' icon={BarChart}>
                                <UserWidgetPreferenceForm preferenceKey={widget_preferences.key.show_skill_bar_chart} />
                            </CUDModal>
                            <CUDModal title='Show/Hide Pie chart' icon={PieChart}>
                                <UserWidgetPreferenceForm preferenceKey={widget_preferences.key.show_skill_pie_chart} />
                            </CUDModal>
                            <CUDModal title='Show/Hide Radar chart' icon={Radar}>
                                <UserWidgetPreferenceForm preferenceKey={widget_preferences.key.show_skill_radar_chart} />
                            </CUDModal>
                        </React.Fragment>
                    }
                </ContentContainer>
                <ContentContainer title='Language'>
                    <CUDModal title='Show/Hide Bar chart' icon={BarChart}>
                        <UserWidgetPreferenceForm preferenceKey={widget_preferences.key.show_language_bar_chart} />
                    </CUDModal>
                    <CUDModal title='Show/Hide Pie chart' icon={PieChart}>
                        <UserWidgetPreferenceForm preferenceKey={widget_preferences.key.show_language_pie_chart} />
                    </CUDModal>
                    <CUDModal title='Show/Hide Radar chart' icon={Radar}>
                        <UserWidgetPreferenceForm preferenceKey={widget_preferences.key.show_language_radar_chart} />
                    </CUDModal>
                </ContentContainer>
            </ContentContainer>
            <ContentContainer title='Chart Preferences' space='lg'>
                <ContentContainer title='Education'>
                    {checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_education_bar_chart) &&
                        <CUDModal title='Customize bar chart' icon={BarChart}>
                            <UserChartPreferenceForm
                                preferenceKeys={
                                    {
                                        widget: chart_preferences.key.widget.education,
                                        chartType: chart_preferences.key.chart.bar
                                    }
                                }
                                preferenceValues={
                                    {
                                        groupBy: chart_preferences.values.education.bar,
                                        valueSource: [
                                            {label: 'Duration', value: 'duration'},
                                            {label: 'Count', value: 'count'}
                                        ]
                                    }
                                }
                            />
                        </CUDModal>
                    }
                    {checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_education_pie_chart) &&
                        <CUDModal title='Customize pie chart' icon={PieChart}>
                            <UserChartPreferenceForm
                                preferenceKeys={
                                    {
                                        widget: chart_preferences.key.widget.education,
                                        chartType: chart_preferences.key.chart.pie
                                    }
                                }
                                preferenceValues={
                                    {
                                        groupBy: chart_preferences.values.education.pie,
                                        valueSource: [
                                            {label: 'Duration', value: 'duration'},
                                            {label: 'Count', value: 'count'}
                                        ]
                                    }
                                }
                            />
                        </CUDModal>
                    }
                    {checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_education_radar_chart) &&
                        <CUDModal title='Customize radar chart' icon={Radar}>
                            <UserChartPreferenceForm
                                preferenceKeys={
                                    {
                                        widget: chart_preferences.key.widget.education,
                                        chartType: chart_preferences.key.chart.radar
                                    }
                                }
                                preferenceValues={
                                    {
                                        groupBy: chart_preferences.values.education.radar,
                                        valueSource: [
                                            {label: 'Duration', value: 'duration'},
                                            {label: 'Count', value: 'count'}
                                        ]
                                    }
                                }
                            />
                        </CUDModal>
                    }
                </ContentContainer>
                <ContentContainer title='Experience'>
                    {checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_experience_bar_chart) &&
                        <CUDModal title='Customize bar chart' icon={BarChart}>
                            <UserChartPreferenceForm
                                preferenceKeys={
                                    {
                                        widget: chart_preferences.key.widget.experience,
                                        chartType: chart_preferences.key.chart.bar
                                    }
                                }
                                preferenceValues={
                                    {
                                        groupBy: chart_preferences.values.experience.bar,
                                        valueSource: [
                                            {label: 'Duration', value: 'duration'},
                                            {label: 'Count', value: 'count'}
                                        ]
                                    }
                                }
                            />
                        </CUDModal>
                    }
                    {checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_experience_pie_chart) &&
                        <CUDModal title='Customize pie chart' icon={PieChart}>
                            <UserChartPreferenceForm
                                preferenceKeys={
                                    {
                                        widget: chart_preferences.key.widget.experience,
                                        chartType: chart_preferences.key.chart.pie
                                    }
                                }
                                preferenceValues={
                                    {
                                        groupBy: chart_preferences.values.experience.pie,
                                        valueSource: [
                                            {label: 'Duration', value: 'duration'},
                                            {label: 'Count', value: 'count'}
                                        ]
                                    }
                                }
                            />
                        </CUDModal>
                    }
                    {checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_experience_radar_chart) &&
                        <CUDModal title='Customize radar chart' icon={Radar}>
                            <UserChartPreferenceForm
                                preferenceKeys={
                                    {
                                        widget: chart_preferences.key.widget.experience,
                                        chartType: chart_preferences.key.chart.radar
                                    }
                                }
                                preferenceValues={
                                    {
                                        groupBy: chart_preferences.values.experience.radar,
                                        valueSource: [
                                            {label: 'Duration', value: 'duration'},
                                            {label: 'Count', value: 'count'}
                                        ]
                                    }
                                }
                            />
                        </CUDModal>
                    }
                </ContentContainer>
                {checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_project_widget) &&
                    <ContentContainer title='Project'>
                        {checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_project_bar_chart) &&
                            <CUDModal title='Customize bar chart' icon={BarChart}>
                                <UserChartPreferenceForm
                                    preferenceKeys={
                                        {
                                            widget: chart_preferences.key.widget.project,
                                            chartType: chart_preferences.key.chart.bar
                                        }
                                    }
                                    preferenceValues={
                                        {
                                            groupBy: chart_preferences.values.project.bar,
                                            valueSource: [
                                                {label: 'Duration', value: 'duration'},
                                                {label: 'Count', value: 'count'}
                                            ]
                                        }
                                    }
                                />
                            </CUDModal>
                        }
                        {checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_project_pie_chart) &&
                            <CUDModal title='Customize pie chart' icon={PieChart}>
                                <UserChartPreferenceForm
                                    preferenceKeys={
                                        {
                                            widget: chart_preferences.key.widget.project,
                                            chartType: chart_preferences.key.chart.pie
                                        }
                                    }
                                    preferenceValues={
                                        {
                                            groupBy: chart_preferences.values.project.pie,
                                            valueSource: [
                                                {label: 'Duration', value: 'duration'},
                                                {label: 'Count', value: 'count'}
                                            ]
                                        }
                                    }
                                />
                            </CUDModal>
                        }
                        {checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_project_radar_chart) &&
                            <CUDModal title='Customize radar chart' icon={Radar}>
                                <UserChartPreferenceForm
                                    preferenceKeys={
                                        {
                                            widget: chart_preferences.key.widget.project,
                                            chartType: chart_preferences.key.chart.radar
                                        }
                                    }
                                    preferenceValues={
                                        {
                                            groupBy: chart_preferences.values.project.radar,
                                            valueSource: [
                                                {label: 'Duration', value: 'duration'},
                                                {label: 'Count', value: 'count'}
                                            ]
                                        }
                                    }
                                />
                            </CUDModal>
                        }
                    </ContentContainer>
                }
            </ContentContainer>
            <ContentContainer title='General' space='lg'>
                {role === 'owner' && username &&
                    <button type="button" onClick={handleLogout} disabled={isLoggingOut} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-danger/25 bg-danger/8 px-4 text-sm font-bold text-danger transition hover:bg-danger/12 disabled:opacity-60">
                        <LogOut className="size-4" aria-hidden="true" />
                        {isLoggingOut ? 'Logging out…' : 'Logout'}
                    </button>
                }
            </ContentContainer>
        </React.Fragment>
    )
}
