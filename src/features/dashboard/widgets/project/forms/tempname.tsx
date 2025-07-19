'use client';
// ProjectTechnologyForm
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { useEffect, useMemo, useState } from "react";
import { mapProjectTechnologyToForm, mergeOptions, OptionsCreator } from "@/lib/utils/appFunctions";
import { ControlledForm } from "@/components/ui/form";
import { Option } from "@/components/ui/form/types";
import { addEditDeleteProjectTechnology, projectTechnologyListQuery, technologyListQuery } from "../apis";
import { ProjectTechnologyProps } from "../types";
import { ProjectTechnologyFormData, projectTechnologySchema } from "../schema";

export const ProjectTechnologyForm = ({id, onClose} : ProjectTechnologyProps) => {

    const dispatch = useAppDispatch();
    const { loading, error, lstProjectTechnologies, technology } = useAppSelector((state) => state.projectTechnology);
    const { loading: technologyLoading, lstTechnologies } = technology;
    const { lstEducations } = useAppSelector(state => state.education);
    const { lstExperiences } = useAppSelector(state => state.experience);
    const projectTechnologyToHandle = lstProjectTechnologies.find(pt => pt.id === id);
    const indicator = id ? {when: 'Update', while: 'Updating...'} : {when: 'Create', while: 'creating...'};
    
    const [ technologyOptions, setTechnologyOptions ] = useState<Option[]>([]);

    const educationOptions = useMemo(() =>
        // Didn't use OptionCreator because the label is a combination of paths
        lstEducations.map((i: any) => ({ label: `${i.institution.name} (${i.degree.abbreviation})`, value: i.id, icon: i.icon }))
    , [lstEducations]);

    const experienceOptions = useMemo(() =>
        OptionsCreator({list: lstExperiences, labelKey: 'companyName'})
    , [lstEducations]);

    const onSubmit = async (data: ProjectTechnologyFormData) => {
        const resultAction = await dispatch(addEditDeleteProjectTechnology(data));

        if (!addEditDeleteProjectTechnology.rejected.match(resultAction)) {
            await dispatch(projectTechnologyListQuery());
            onClose?.();
        }
    };

    const items = useMemo(() => [
        {as: 'DropdownMulti', name: 'lstTechnologies', options: technologyOptions, label: 'Technologies', fetchAction: technologyListQuery, isLoading: technologyLoading},
        {as: 'Dropdown', name: 'EducationID', options: educationOptions, label: 'Corresponding education'},
        {as: 'Dropdown', name: 'ExperienceID', options: experienceOptions, label: 'Corresponding experience'},
        {as: 'Input', name: 'title', label: 'Title', placeholder: 'MyProject'},
        {as: 'Input', name: 'liveLink', label: 'Live link', placeholder: 'https://MyProject.com'},
        {as: 'Input', name: 'sourceCode', label: 'Source code', placeholder: 'https://github.com/'},
        {as: 'Input', name: 'imageUrl', label: 'Image URL', placeholder: 'https://Image'},
        {as: 'Checkbox', name: 'isFeatured', label: 'Is featured?'},
        {as: 'Input', name: 'description', label: 'Description', placeholder: 'Description', type: 'Textarea'}
    ], [technologyOptions, educationOptions, experienceOptions, technologyLoading]);
    
    const resetItems = useMemo(
        () => mapProjectTechnologyToForm(projectTechnologyToHandle),
    [projectTechnologyToHandle]);

    useEffect(() => {
        const { lstTechnologies: ltfe } = projectTechnologyToHandle ?? {};
        const technologiesFromEdit = ltfe ? OptionsCreator({list: ltfe, iconKey: 'iconUrl'}) : [];
        const technologiesStore = OptionsCreator({list: lstTechnologies, iconKey: 'iconUrl'});
        setTechnologyOptions(mergeOptions(technologiesFromEdit, technologiesStore));

    }, [projectTechnologyToHandle, lstTechnologies]);

    return (
        <ControlledForm
            schema={projectTechnologySchema}
            onSubmit={onSubmit}
            items={items as any}
            error={error}
            loading={loading}
            defaultValues={{isStudying: false}}
            resetItems={resetItems as any}
            indicator={indicator}
        />
    );
}