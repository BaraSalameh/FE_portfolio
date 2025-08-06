'use client';

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { useEffect, useMemo, useState } from "react";
import { mapProjectToForm, mergeOptions, optionsCreator } from "@/lib/utils";
import { ControlledForm } from "@/components/forms";
import { Option } from "@/features/types.features";
import { addEditProject, projectListQuery } from "../apis";
import { ProjectProps } from "../types.project";
import { ProjectFormData, projectSchema } from "../schema";
import { skillListQuery } from "../../skill";

export const ProjectForm = ({id, onClose} : ProjectProps) => {

    const dispatch = useAppDispatch();
    const { loading: skillLoading, lstSkills } = useAppSelector((state) => state.userSkill.skill);
    const { loading, error, lstProjects } = useAppSelector((state) => state.project);
    const { lstEducations } = useAppSelector(state => state.education);
    const { lstExperiences } = useAppSelector(state => state.experience);
    const projectToHandle = lstProjects.find(pt => pt.id === id);
    const indicator = id ? {when: 'Update', while: 'Updating...'} : {when: 'Create', while: 'creating...'};

    const educationOptions = useMemo(() =>
        // Didn't use OptionCreator because the label is a combination of paths
        lstEducations.map((i: any) => ({ label: `${i.institution.name} (${i.degree.abbreviation})`, value: i.id, icon: i.icon }))
    , [lstEducations]);

    const experienceOptions = useMemo(() =>
        optionsCreator({list: lstExperiences, labelKey: 'companyName'})
    , [lstEducations]);

    const [ skillOptions, setSkillOptions ] = useState<Option[]>([]);

    const onSubmit = async (data: ProjectFormData) => {
        const resultAction = await dispatch(addEditProject(data));

        if (!addEditProject.rejected.match(resultAction)) {
            await dispatch(projectListQuery());
            onClose?.();
        }
    };

    const items = useMemo(() => [
        {as: 'DropdownMulti', name: 'lstSkills', options: skillOptions, label: 'Skills', fetchAction: skillListQuery, isLoading: skillLoading},
        {as: 'Dropdown', name: 'EducationID', options: educationOptions, label: 'Corresponding education'},
        {as: 'Dropdown', name: 'ExperienceID', options: experienceOptions, label: 'Corresponding experience'},
        {as: 'Input', name: 'title', label: 'Title', placeholder: 'MyProject'},
        {as: 'Input', name: 'liveLink', label: 'Live link', placeholder: 'https://MyProject.com'},
        {as: 'Input', name: 'sourceCode', label: 'Source code', placeholder: 'https://github.com/'},
        {as: 'Input', name: 'imageUrl', label: 'Image URL', placeholder: 'https://Image'},
        {as: 'Checkbox', name: 'isFeatured', label: 'Is featured?'},
        {as: 'Input', name: 'description', label: 'Description', placeholder: 'Description', type: 'Textarea'}
    ], [ skillOptions, educationOptions, experienceOptions ]);
    
    const resetItems = useMemo(
        () => mapProjectToForm(projectToHandle),
    [projectToHandle]);

    useEffect(() => {
        const { lstSkills: lsfe } = projectToHandle ?? {};
        const skillsFromEdit = lsfe ? optionsCreator({list: lsfe, iconKey: 'iconUrl'}) : [];
        const skillsStore = optionsCreator({list: lstSkills, iconKey: 'iconUrl'});
        setSkillOptions(mergeOptions(skillsFromEdit, skillsStore));

    }, [projectToHandle, lstSkills]);

    return (
        <ControlledForm
            schema={projectSchema}
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