import { JSX, useMemo } from "react";
import { WidgetCardProps } from "@/components/ui/widget/types";
import { ControlledWidget } from "@/components";
import { useEducationWidget, useExperienceWidget, useLanguageWidget, useProjectWidget } from ".";

export const useWidgets = () => {

    const projectData = useProjectWidget();
    const educationData = useEducationWidget();
    const experienceData = useExperienceWidget();
    const languageData = useLanguageWidget();

    const renderWidgets = useMemo((): JSX.Element[] => {
        const widgets: WidgetCardProps[] = [
            educationData,
            projectData,
            experienceData,
            languageData,
        ];

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