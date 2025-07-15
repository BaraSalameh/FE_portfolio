import React from 'react';
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ContentContainer } from '@/components/ui/ContentContainer';
import UserPreferenceForm from '@/app/[role]/[username]/forms/userPreferenceForm';
import { CUDModal, Paragraph, ResponsiveIcon } from '@/components';
import { BarChart, Calendar, Component, LogOut, Mail, Mars, Phone, PieChart, Radar, SunMoonIcon } from 'lucide-react';
import { PREFERENCES } from '@/lib/constants';
import { getUrlParams } from '@/lib/utils/appFunctions';
import { useRouter } from 'next/navigation';

const SettingsPage = () => {

    const router = useRouter();
    const {role, username} = getUrlParams();

    return (
        <React.Fragment>
            <ContentContainer title='Preferences' space='lg'>
                <CUDModal title='Change theme' icon={SunMoonIcon}>
                    <ThemeToggle title="Click to change theme" />
                </CUDModal>
                <ContentContainer title='Profile'>
                    <CUDModal title='Show/Hide gender' icon={Mars}>
                        <UserPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_GENDER} />
                    </CUDModal>
                    <CUDModal title='Show/Hide birthdate' icon={Calendar}>
                        <UserPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_BIRTHDATE} />
                    </CUDModal>
                    <CUDModal title='Show/Hide email address' icon={Mail}>
                        <UserPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_EMAIL_ADDRESS} />
                    </CUDModal>
                    <CUDModal title='Show/Hide phone number' icon={Phone}>
                        <UserPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_PHONE_NUMBER} />
                    </CUDModal>
                    {/* <CUDModal title='Profile' icon={ChartNoAxesGanttIcon}>
                        <UserPreferenceForm
                            preferenceKey={PREFERENCES.KEY.PROFILE_PICTURE_POSITION}
                            preferenceValues={PREFERENCES.VALUE.CUSTOM.POSITION}
                        />
                    </CUDModal> */}
                </ContentContainer>
                <ContentContainer title='Overview'>
                    <CUDModal title='Show/Hide widget' icon={Component}>
                        <UserPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_OVERVIEW_WIDGET} />
                    </CUDModal>
                    <CUDModal title='Show/Hide Bar chart' icon={BarChart}>
                        <UserPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_OVERVIEW_BAR_CHART} />
                    </CUDModal>
                    <CUDModal title='Show/Hide Pie chart' icon={PieChart}>
                        <UserPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_OVERVIEW_PIE_CHART} />
                    </CUDModal>
                    <CUDModal title='Show/Hide Radar chart' icon={Radar}>
                        <UserPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_OVERVIEW_RADAR_CHART} />
                    </CUDModal>
                </ContentContainer>
                <ContentContainer title='Education'>
                    <CUDModal title='Show/Hide Bar chart' icon={BarChart}>
                        <UserPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_EDUCATION_BAR_CHART} />
                    </CUDModal>
                    <CUDModal title='Show/Hide Pie chart' icon={PieChart}>
                        <UserPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_EDUCATION_PIE_CHART} />
                    </CUDModal>
                    <CUDModal title='Show/Hide Radar chart' icon={Radar}>
                        <UserPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_EDUCATION_RADAR_CHART} />
                    </CUDModal>
                </ContentContainer>
                <ContentContainer title='Experience'>
                    <CUDModal title='Show/Hide Bar chart' icon={BarChart}>
                        <UserPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_EXPERIENCE_BAR_CHART} />
                    </CUDModal>
                    <CUDModal title='Show/Hide Pie chart' icon={PieChart}>
                        <UserPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_EXPERIENCE_PIE_CHART} />
                    </CUDModal>
                    <CUDModal title='Show/Hide Radar chart' icon={Radar}>
                        <UserPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_EXPERIENCE_RADAR_CHART} />
                    </CUDModal>
                </ContentContainer>
                <ContentContainer title='Project'>
                    <CUDModal title='Show/Hide widget' icon={Component}>
                        <UserPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_PROJECT_WIDGET} />
                    </CUDModal>
                    <CUDModal title='Show/Hide Bar chart' icon={BarChart}>
                        <UserPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_PROJECT_BAR_CHART} />
                    </CUDModal>
                    <CUDModal title='Show/Hide Pie chart' icon={PieChart}>
                        <UserPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_PROJECT_PIE_CHART} />
                    </CUDModal>
                    <CUDModal title='Show/Hide Radar chart' icon={Radar}>
                        <UserPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_PROJECT_RADAR_CHART} />
                    </CUDModal>
                </ContentContainer>
                <ContentContainer title='Language'>
                    <CUDModal title='Show/Hide Bar chart' icon={BarChart}>
                        <UserPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_LANGUAGE_BAR_CHART} />
                    </CUDModal>
                    <CUDModal title='Show/Hide Pie chart' icon={PieChart}>
                        <UserPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_LANGUAGE_PIE_CHART} />
                    </CUDModal>
                    <CUDModal title='Show/Hide Radar chart' icon={Radar}>
                        <UserPreferenceForm preferenceKey={PREFERENCES.KEY.SHOW_LANGUAGE_RADAR_CHART} />
                    </CUDModal>
                </ContentContainer>
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

export default SettingsPage;