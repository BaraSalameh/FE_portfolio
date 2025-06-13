'use client';

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { useEffect, useMemo, useState } from "react";
import { ProjectTechnologyProps } from "../types";
import { ProjectTechnologyFormData, projectTechnologySchema } from "@/lib/schemas";
import { projectTechnologyListQuery, technologyListQuery, addEditDeleteProjectTechnology } from "@/lib/apis/owner/projectTechnology";
import { mapProjectTechnologyToForm, mergeOptions } from "@/lib/utils/appFunctions";
import { ControlledForm } from "@/components/ui/form";
import { Option } from "@/components/ui/form/types";

const ProjectTechnologyForm = ({id, onClose} : ProjectTechnologyProps) => {

    const dispatch = useAppDispatch();
    const { loading, error, lstProjectTechnologies, lstTechnologies } = useAppSelector((state) => state.projectTechnology);
    const { lstEducations } = useAppSelector(state => state.education);
    const { lstExperiences } = useAppSelector(state => state.experience);
    const projectTechnologyToHandle = lstProjectTechnologies.find(pt => pt.id === id);
    const indicator = id ? {when: 'Update', while: 'Updating...'} : {when: 'Create', while: 'creating...'};
    
    const [ technologyOptions, setTechnologyOptions ] = useState<Option[]>([]);

    const educationOptions = useMemo(() =>
        lstEducations.map((i: any) => ({ label: `${i.institution.name} (${i.degree.abbreviation})`, value: i.id }))
    , [lstEducations]);

    const experienceOptions = useMemo(() =>
        lstExperiences.map(i => ({ label: i.companyName, value: i.id }))
    , [lstEducations]);

    const onSubmit = async (data: ProjectTechnologyFormData) => {
        const resultAction = await dispatch(addEditDeleteProjectTechnology(data));

        if (!addEditDeleteProjectTechnology.rejected.match(resultAction)) {
            await dispatch(projectTechnologyListQuery());
            onClose?.();
        }
    };

    useEffect(() => {
        const { lstTechnologies: ltfe } = projectTechnologyToHandle ?? {};
        const technologiesFromEdit = ltfe ? ltfe.map((t: any) => ({ label: t.name, value: t.id })) : [];
        const technologiesStore = lstTechnologies?.map((i: any) => ({ label: i.name, value: i.id }));
        setTechnologyOptions(mergeOptions(technologiesFromEdit, technologiesStore));
        
    }, [projectTechnologyToHandle, lstTechnologies]);

    return (
        <ControlledForm
            schema={projectTechnologySchema}
            onSubmit={onSubmit}
            items={[
                {as: 'DropdownMulti', name: 'lstTechnologies', options: technologyOptions, label: 'Technologies', fetchAction: technologyListQuery, isLoading: loading},
                {as: 'Dropdown', name: 'EducationID', options: educationOptions, label: 'Corresponding education'},
                {as: 'Dropdown', name: 'ExperienceID', options: experienceOptions, label: 'Corresponding experience'},
                {as: 'Input', name: 'title', label: 'Title', placeholder: 'Protfolio'},
                {as: 'Input', name: 'liveLink', label: 'Live link', placeholder: 'https://MyProject'},
                {as: 'Input', name: 'sourceCode', label: 'Source code', placeholder: 'https://LinkedIn'},
                {as: 'Input', name: 'imageUrl', label: 'Source code', placeholder: 'https://Image'},
                {as: 'Checkbox', name: 'isFeatured', label: 'Is featured?'},
                {as: 'Input', name: 'description', label: 'Description', placeholder: 'Description', type: 'Textarea'}
            ]}
            error={error}
            loading={loading}
            defaultValues={{isStudying: false}}
            resetItems={mapProjectTechnologyToForm(projectTechnologyToHandle) as any}
            indicator={indicator}
        />
    );
}

export default ProjectTechnologyForm;