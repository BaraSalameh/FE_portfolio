"use client";

import React from 'react';
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ContentContainer } from '@/components';
import { CUDModal, Paragraph, ResponsiveIcon } from '@/components';
import { BarChart, Calendar, Component, LogOut, Mail, Mars, Phone, PieChart, Radar, SunMoonIcon } from 'lucide-react';
import { PREFERENCES, CHART_PREFERENCES } from '@/lib/constants';
import { CheckPreferences, getUrlParams } from '@/lib/utils/appFunctions';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/store/hooks';
import { UserWidgetPreferenceForm } from '../widget-preferences/forms/UserWidgetPreferenceForm';
import { UserChartPreferenceForm } from '../chart-preferences/forms/UserChartPreferenceForm';

export const SettingsPage = () => {

    const router = useRouter();
    const {role, username} = getUrlParams();
    const { lstUserPreferences } = useAppSelector(state => state.userWidgetPreference);

    return (
        <React.Fragment>
            <ContentContainer title='Preferences' space='lg'>
                <CUDModal title='Change theme' icon={SunMoonIcon}>
                    <ThemeToggle title="Click to change theme" />
                </CUDModal>
                <ContentContainer title='Profile'>
                    <CUDModal title='Show/Hide gender' icon={Mars}>
                        <UserWidgetPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_GENDER} />
                    </CUDModal>
                    <CUDModal title='Show/Hide birthdate' icon={Calendar}>
                        <UserWidgetPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_BIRTHDATE} />
                    </CUDModal>
                    <CUDModal title='Show/Hide email address' icon={Mail}>
                        <UserWidgetPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_EMAIL_ADDRESS} />
                    </CUDModal>
                    <CUDModal title='Show/Hide phone number' icon={Phone}>
                        <UserWidgetPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_PHONE_NUMBER} />
                    </CUDModal>
                </ContentContainer>
                <ContentContainer title='Overview'>
                    <CUDModal title='Show/Hide widget' icon={Component}>
                        <UserWidgetPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_OVERVIEW_WIDGET} />
                    </CUDModal>
                    {CheckPreferences(lstUserPreferences, PREFERENCES.KEY.SHOW_OVERVIEW_WIDGET) &&
                        <React.Fragment>
                            <CUDModal title='Show/Hide Bar chart' icon={BarChart}>
                                <UserWidgetPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_OVERVIEW_BAR_CHART} />
                            </CUDModal>
                            <CUDModal title='Show/Hide Pie chart' icon={PieChart}>
                                <UserWidgetPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_OVERVIEW_PIE_CHART} />
                            </CUDModal>
                            <CUDModal title='Show/Hide Radar chart' icon={Radar}>
                                <UserWidgetPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_OVERVIEW_RADAR_CHART} />
                            </CUDModal>
                        </React.Fragment>
                    }
                </ContentContainer>
                <ContentContainer title='Education'>
                    <CUDModal title='Show/Hide Bar chart' icon={BarChart}>
                        <UserWidgetPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_EDUCATION_BAR_CHART} />
                    </CUDModal>
                    <CUDModal title='Show/Hide Pie chart' icon={PieChart}>
                        <UserWidgetPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_EDUCATION_PIE_CHART} />
                    </CUDModal>
                    <CUDModal title='Show/Hide Radar chart' icon={Radar}>
                        <UserWidgetPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_EDUCATION_RADAR_CHART} />
                    </CUDModal>
                </ContentContainer>
                <ContentContainer title='Experience'>
                    <CUDModal title='Show/Hide Bar chart' icon={BarChart}>
                        <UserWidgetPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_EXPERIENCE_BAR_CHART} />
                    </CUDModal>
                    <CUDModal title='Show/Hide Pie chart' icon={PieChart}>
                        <UserWidgetPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_EXPERIENCE_PIE_CHART} />
                    </CUDModal>
                    <CUDModal title='Show/Hide Radar chart' icon={Radar}>
                        <UserWidgetPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_EXPERIENCE_RADAR_CHART} />
                    </CUDModal>
                </ContentContainer>
                <ContentContainer title='Project'>
                    <CUDModal title='Show/Hide widget' icon={Component}>
                        <UserWidgetPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_PROJECT_WIDGET} />
                    </CUDModal>
                    {CheckPreferences(lstUserPreferences, PREFERENCES.KEY.SHOW_PROJECT_WIDGET) &&
                        <React.Fragment>
                            <CUDModal title='Show/Hide Bar chart' icon={BarChart}>
                                <UserWidgetPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_PROJECT_BAR_CHART} />
                            </CUDModal>
                            <CUDModal title='Show/Hide Pie chart' icon={PieChart}>
                                <UserWidgetPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_PROJECT_PIE_CHART} />
                            </CUDModal>
                            <CUDModal title='Show/Hide Radar chart' icon={Radar}>
                                <UserWidgetPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_PROJECT_RADAR_CHART} />
                            </CUDModal>
                        </React.Fragment>
                    }
                </ContentContainer>
                <ContentContainer title='Language'>
                    <CUDModal title='Show/Hide Bar chart' icon={BarChart}>
                        <UserWidgetPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_LANGUAGE_BAR_CHART} />
                    </CUDModal>
                    <CUDModal title='Show/Hide Pie chart' icon={PieChart}>
                        <UserWidgetPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_LANGUAGE_PIE_CHART} />
                    </CUDModal>
                    <CUDModal title='Show/Hide Radar chart' icon={Radar}>
                        <UserWidgetPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_LANGUAGE_RADAR_CHART} />
                    </CUDModal>
                </ContentContainer>
            </ContentContainer>
            <ContentContainer title='Chart Preferences' space='lg'>
                <ContentContainer title='Education'>
                    {CheckPreferences(lstUserPreferences, PREFERENCES.KEY.SHOW_EDUCATION_BAR_CHART) &&
                        <CUDModal title='Customize bar chart' icon={BarChart}>
                            <UserChartPreferenceForm
                                preferenceKeys={
                                    {
                                        widget: CHART_PREFERENCES.KEY.WIDGET.Education,
                                        chartType: CHART_PREFERENCES.KEY.CHART.Bar
                                    }
                                }
                                preferenceValues={
                                    {
                                        groupBy: CHART_PREFERENCES.VALUES.Education.BAR,
                                        valueSource: [
                                            {label: 'Duration', value: 'duration'},
                                            {label: 'Count', value: 'count'}
                                        ]
                                    }
                                }
                            />
                        </CUDModal>
                    }
                    {CheckPreferences(lstUserPreferences, PREFERENCES.KEY.SHOW_EDUCATION_PIE_CHART) &&
                        <CUDModal title='Customize pie chart' icon={PieChart}>
                            <UserChartPreferenceForm
                                preferenceKeys={
                                    {
                                        widget: CHART_PREFERENCES.KEY.WIDGET.Education,
                                        chartType: CHART_PREFERENCES.KEY.CHART.Pie
                                    }
                                }
                                preferenceValues={
                                    {
                                        groupBy: CHART_PREFERENCES.VALUES.Education.PIE,
                                        valueSource: [
                                            {label: 'Duration', value: 'duration'},
                                            {label: 'Count', value: 'count'}
                                        ]
                                    }
                                }
                            />
                        </CUDModal>
                    }
                    {CheckPreferences(lstUserPreferences, PREFERENCES.KEY.SHOW_EDUCATION_RADAR_CHART) &&
                        <CUDModal title='Customize radar chart' icon={Radar}>
                            <UserChartPreferenceForm
                                preferenceKeys={
                                    {
                                        widget: CHART_PREFERENCES.KEY.WIDGET.Education,
                                        chartType: CHART_PREFERENCES.KEY.CHART.Radar
                                    }
                                }
                                preferenceValues={
                                    {
                                        groupBy: CHART_PREFERENCES.VALUES.Education.RADAR,
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
                    {CheckPreferences(lstUserPreferences, PREFERENCES.KEY.SHOW_EXPERIENCE_BAR_CHART) &&
                        <CUDModal title='Customize bar chart' icon={BarChart}>
                            <UserChartPreferenceForm
                                preferenceKeys={
                                    {
                                        widget: CHART_PREFERENCES.KEY.WIDGET.Experience,
                                        chartType: CHART_PREFERENCES.KEY.CHART.Bar
                                    }
                                }
                                preferenceValues={
                                    {
                                        groupBy: CHART_PREFERENCES.VALUES.Experience.BAR,
                                        valueSource: [
                                            {label: 'Duration', value: 'duration'},
                                            {label: 'Count', value: 'count'}
                                        ]
                                    }
                                }
                            />
                        </CUDModal>
                    }
                    {CheckPreferences(lstUserPreferences, PREFERENCES.KEY.SHOW_EXPERIENCE_PIE_CHART) &&
                        <CUDModal title='Customize pie chart' icon={PieChart}>
                            <UserChartPreferenceForm
                                preferenceKeys={
                                    {
                                        widget: CHART_PREFERENCES.KEY.WIDGET.Experience,
                                        chartType: CHART_PREFERENCES.KEY.CHART.Pie
                                    }
                                }
                                preferenceValues={
                                    {
                                        groupBy: CHART_PREFERENCES.VALUES.Experience.PIE,
                                        valueSource: [
                                            {label: 'Duration', value: 'duration'},
                                            {label: 'Count', value: 'count'}
                                        ]
                                    }
                                }
                            />
                        </CUDModal>
                    }
                    {CheckPreferences(lstUserPreferences, PREFERENCES.KEY.SHOW_EXPERIENCE_RADAR_CHART) &&
                        <CUDModal title='Customize radar chart' icon={Radar}>
                            <UserChartPreferenceForm
                                preferenceKeys={
                                    {
                                        widget: CHART_PREFERENCES.KEY.WIDGET.Experience,
                                        chartType: CHART_PREFERENCES.KEY.CHART.Radar
                                    }
                                }
                                preferenceValues={
                                    {
                                        groupBy: CHART_PREFERENCES.VALUES.Experience.RADAR,
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
                {CheckPreferences(lstUserPreferences, PREFERENCES.KEY.SHOW_PROJECT_WIDGET) &&
                    <ContentContainer title='Project'>
                        {CheckPreferences(lstUserPreferences, PREFERENCES.KEY.SHOW_PROJECT_BAR_CHART) &&
                            <CUDModal title='Customize bar chart' icon={BarChart}>
                                <UserChartPreferenceForm
                                    preferenceKeys={
                                        {
                                            widget: CHART_PREFERENCES.KEY.WIDGET.Project,
                                            chartType: CHART_PREFERENCES.KEY.CHART.Bar
                                        }
                                    }
                                    preferenceValues={
                                        {
                                            groupBy: CHART_PREFERENCES.VALUES.Project.BAR,
                                            valueSource: [
                                                {label: 'Duration', value: 'duration'},
                                                {label: 'Count', value: 'count'}
                                            ]
                                        }
                                    }
                                />
                            </CUDModal>
                        }
                        {CheckPreferences(lstUserPreferences, PREFERENCES.KEY.SHOW_PROJECT_PIE_CHART) &&
                            <CUDModal title='Customize pie chart' icon={PieChart}>
                                <UserChartPreferenceForm
                                    preferenceKeys={
                                        {
                                            widget: CHART_PREFERENCES.KEY.WIDGET.Project,
                                            chartType: CHART_PREFERENCES.KEY.CHART.Pie
                                        }
                                    }
                                    preferenceValues={
                                        {
                                            groupBy: CHART_PREFERENCES.VALUES.Project.PIE,
                                            valueSource: [
                                                {label: 'Duration', value: 'duration'},
                                                {label: 'Count', value: 'count'}
                                            ]
                                        }
                                    }
                                />
                            </CUDModal>
                        }
                        {CheckPreferences(lstUserPreferences, PREFERENCES.KEY.SHOW_PROJECT_RADAR_CHART) &&
                            <CUDModal title='Customize radar chart' icon={Radar}>
                                <UserChartPreferenceForm
                                    preferenceKeys={
                                        {
                                            widget: CHART_PREFERENCES.KEY.WIDGET.Project,
                                            chartType: CHART_PREFERENCES.KEY.CHART.Radar
                                        }
                                    }
                                    preferenceValues={
                                        {
                                            groupBy: CHART_PREFERENCES.VALUES.Project.RADAR,
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
                    <Paragraph onClick={() => router.push(`/${role}/${username}/logout`)}>
                        <ResponsiveIcon icon={LogOut} />
                        Logout
                    </Paragraph>
                }
            </ContentContainer>
        </React.Fragment>
    )
}