import { JSX, useMemo } from "react";
import { WidgetCardProps } from "@/components/ui/widget/types";
import { ControlledWidget } from "@/components";
import { useEducationWidget, useExperienceWidget, useLanguageWidget, useProjectWidget } from ".";
import { CheckPreferences } from "@/lib/utils/appFunctions";
import { PREFERENCES } from "@/lib/constants";
import { useAppSelector } from "@/lib/store/hooks";

export const useWidgets = () => {

    const { lstUserPreferences } = useAppSelector(state => state.userPreference);
    const projectData = useProjectWidget();
    const educationData = useEducationWidget();
    const experienceData = useExperienceWidget();
    const languageData = useLanguageWidget();

    const showProjectWidget = CheckPreferences(lstUserPreferences, PREFERENCES.KEY.SHOW_PROJECT_WIDGET);

    const renderWidgets = useMemo((): JSX.Element[] => {
        const widgets: WidgetCardProps[] = [
            educationData,
            experienceData,
            languageData,
        ];

        if (showProjectWidget) {
            widgets.splice(1, 0, projectData);
        }

        return widgets.map((widget, index) => (
            <div key={widget?.header?.title || index} className="break-inside-avoid">
                <ControlledWidget
                    {...widget}
                />
            </div>
        ));
    }, [projectData, educationData, experienceData, languageData]);

    return renderWidgets;
};