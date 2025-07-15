import { WidgetCardProps } from "@/components/ui/widget/types";
import { useAppSelector } from "@/lib/store/hooks";
import { Folder, Link, SearchCodeIcon, WandSparklesIcon } from "lucide-react";
import ProjectTechnologyForm from "../../forms/projectTechnologyForm";
import { useDebouncedSortProject, useHandleProjectDelete } from "../handlers";
import { CheckPreferences } from "@/lib/utils/appFunctions";
import { PREFERENCES } from "@/lib/constants";

export const useProjectWidget = (): WidgetCardProps => {
    
    const { loading: projectTechnologyLoading, lstProjectTechnologies } = useAppSelector(state => state.projectTechnology);
    const handleProjectDelete = useHandleProjectDelete();
    const debouncedSortProject = useDebouncedSortProject();

    const barData = CheckPreferences(PREFERENCES.KEY.SHOW_PROJECT_BAR_CHART)
        ?   { title: 'Technology proficiency overview (count)', groupBy: 'lstTechnologies.name' }
        :   {};
    
        const pieData = CheckPreferences(PREFERENCES.KEY.SHOW_PROJECT_PIE_CHART)
        ?   { title: 'Projects Overview', groupBy: 'title' }
        :   {};
    
        const radarData = CheckPreferences(PREFERENCES.KEY.SHOW_PROJECT_RADAR_CHART)
        ?   { title: 'Technology proficiency overview (count)', groupBy: 'lstTechnologies.name' }
        :   {};

    return {
        isLoading: projectTechnologyLoading,
        items: lstProjectTechnologies,
        header: { title: 'Project', icon: Folder },
        bar: barData,
        radar: radarData,
        pie: pieData,
        list: [
            { leftKey: 'title', between: '-', rightKey: ['experience.companyName', 'education.institution.name'], size: 'lg' },
            { leftKey: 'isFeatured' }
        ],
        create: { subTitle: 'Add Project & technologis', form: <ProjectTechnologyForm /> },
        update: { subTitle: 'Update Project & technologies', form: <ProjectTechnologyForm /> },
        del: { subTitle: 'Delete Project', message: 'Are you sure?', onDelete: handleProjectDelete },
        details: [
            { leftKey: 'title', size: 'lg' },
            { leftKey: 'liveLink', icon: Link, isLink: true },
            { leftKey: 'sourceCode', icon: SearchCodeIcon , isLink: true},
            { leftKey: 'lstTechnologies.name', icon: WandSparklesIcon, itemIcon: 'lstTechnologies.iconUrl' },
            { leftKey: 'description', size: 'sm' }
        ],
        onSort: debouncedSortProject
    }
}