import React from 'react';
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ContentContainer } from '@/components/ui/ContentContainer';

const SettingsPage = () => {

    return (
        <React.Fragment>
            <ThemeToggle title="Current theme: " themeNameIncluded={true} className='w-full'/>
            <ContentContainer title='Preferences'>
                <ContentContainer title='Education charts'>
                    <ThemeToggle title="Change current theme: " themeNameIncluded={true} />
                </ContentContainer>
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
            </ContentContainer>
            <ContentContainer title='Education charts'>
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
                <ThemeToggle title="Current theme: " themeNameIncluded={true} />
            </ContentContainer>
        </React.Fragment>
    )
}

export default SettingsPage;