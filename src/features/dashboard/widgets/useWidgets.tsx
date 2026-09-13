import { DashboardWidget } from '@/features/dashboard/presentation';
import { checkWidgetPreferences } from "@/lib/utils";
import { widget_preferences } from "@/lib/utils";
import { useAppSelector } from "@/lib/store/hooks";
import { useEducationWidget } from "./education/hooks";
import { useExperienceWidget } from "./experience/hooks/useExperienceWidget";
import { useProjectWidget } from "./project/hooks";
import { useLanguageWidget } from "./language/hooks";
import { useSkillWidget } from "./skill";
import { useCertificateWidget } from "./certificate/hooks";
import { memo } from 'react';

const ProjectWidget = memo(function ProjectWidget() {
    return <DashboardWidget {...useProjectWidget()} />;
});

const EducationWidget = memo(function EducationWidget() {
    return <DashboardWidget {...useEducationWidget()} />;
});

const ExperienceWidget = memo(function ExperienceWidget() {
    return <DashboardWidget {...useExperienceWidget()} />;
});

const LanguageWidget = memo(function LanguageWidget() {
    return <DashboardWidget {...useLanguageWidget()} />;
});

const SkillWidget = memo(function SkillWidget() {
    return <DashboardWidget {...useSkillWidget()} />;
});

const CertificateWidget = memo(function CertificateWidget() {
    return <DashboardWidget {...useCertificateWidget()} />;
});

export const PortfolioWidgets = memo(function PortfolioWidgets() {

    const { lstUserPreferences } = useAppSelector(state => state.userWidgetPreference);

    const showProjectWidget = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_project_widget);
    const showSkillWidget = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_skill_widget);
    const showCertificateWidget = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_certificate_widget);

    return (
        <>
            <div className="break-inside-avoid"><EducationWidget /></div>
            {showCertificateWidget && <div className="break-inside-avoid"><CertificateWidget /></div>}
            {showSkillWidget && <div className="break-inside-avoid"><SkillWidget /></div>}
            {showProjectWidget && <div className="break-inside-avoid"><ProjectWidget /></div>}
            <div className="break-inside-avoid"><ExperienceWidget /></div>
            <div className="break-inside-avoid"><LanguageWidget /></div>
        </>
    );
});
