import { JSX, useMemo } from "react";
import { WidgetCardProps } from "@/components/widgets/types.widgets";
import { ControlledWidget } from "@/components";
import { checkWidgetPreferences } from "@/lib/utils";
import { widget_preferences } from "@/lib/utils";
import { useAppSelector } from "@/lib/store/hooks";
import { useEducationWidget } from "./education/hooks";
import { useExperienceWidget } from "./experience/hooks/useExperienceWidget";
import { useProjectWidget } from "./project/hooks";
import { useLanguageWidget } from "./language/hooks";
import { useSkillWidget } from "./skill";

export const useWidgets = () => {

    const { lstUserPreferences } = useAppSelector(state => state.userWidgetPreference);
    const projectData = useProjectWidget();
    const educationData = useEducationWidget();
    const experienceData = useExperienceWidget();
    const languageData = useLanguageWidget();
    const skillData = useSkillWidget();

    const showProjectWidget = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_project_widget);
    const showSkillWidget = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_skill_widget);

    const renderWidgets = useMemo((): JSX.Element[] => {
        const widgets: WidgetCardProps[] = [
            educationData,
            experienceData,
            languageData,
        ];

        if (showProjectWidget) {
            widgets.splice(1, 0, projectData);
        }

        if (showSkillWidget) {
            widgets.splice(2, 0, skillData);
        }

        return widgets.map((widget, index) => (
            <div key={widget?.header?.title || index} className="break-inside-avoid">
                <ControlledWidget
                    {...widget}
                />
            </div>
        ));
    }, [projectData, skillData, educationData, experienceData, languageData]);

    return renderWidgets;
};