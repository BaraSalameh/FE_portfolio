'use client';

import { useAppSelector } from "@/lib/store/hooks";
import { useMemo } from "react";
import { mapProjectToForm, optionsCreator } from "@/lib/utils";
import { ControlledForm } from "@/components/forms";
import { ProjectProps } from "../types.project";
import { projectSchema } from "../schema";
import { skillListQuery } from "../../skill";
import { useHandleSubmit } from "../hooks";
import { useLoadUserSkill } from "@/features/dashboard/hooks";

export const ProjectForm = ({id, onClose} : ProjectProps) => {

    const { loading, error, lstProjects } = useAppSelector((state) => state.project);
    const { loading: skillLoading } = useAppSelector((state) => state.userSkill.skill);
    const { lstEducations } = useAppSelector(state => state.education);
    const { lstExperiences } = useAppSelector(state => state.experience);

    const projectToHandle = useMemo(() => lstProjects.find(p => p.id === id), [lstProjects]);
    const indicator = id ? {when: 'Update', while: 'Updating...'} : {when: 'Create', while: 'creating...'};

    const educationOptions = useMemo(() =>
        // Didn't use OptionCreator because the label is a combination of paths
        lstEducations.map((i: any) => ({ label: `${i.institution.name} (${i.degree.abbreviation})`, value: i.id, icon: i.icon }))
    , [lstEducations]);

    const experienceOptions = useMemo(() =>
        optionsCreator({list: lstExperiences, labelKey: 'companyName'})
    , [lstEducations]);

    const skillOptions = useLoadUserSkill(projectToHandle);
    const onSubmit = useHandleSubmit({onClose});
    const resetItems = useMemo(() => mapProjectToForm(projectToHandle), [projectToHandle]);

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