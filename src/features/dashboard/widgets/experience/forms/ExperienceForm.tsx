'use client';

import { useAppSelector } from "@/lib/store/hooks";
import { ControlledForm } from "@/components/forms";
import { useMemo } from "react";
import { ExperienceProps } from "../types.experience";
import { experienceSchema } from "../schema";
import { mapExperienceToForm } from "@/lib/utils";
import { skillListQuery } from "../../skill";
import { useLoadUserSkill } from "@/features/dashboard/hooks";
import { useHandleSubmit } from "../hooks";

export const ExperienceForm = ({id, onClose} : ExperienceProps) => {

    const { loading, error, lstExperiences } = useAppSelector((state) => state.experience);
    const { loading: skillLoading } = useAppSelector((state) => state.userSkill.skill);
    
    const experienceToHandle = useMemo(() => lstExperiences.find(ex => ex.id === id), [lstExperiences]);
    const indicator = id ? {when: 'Update', while: 'Updating...'} : {when: 'Create', while: 'creating...'};

    const skillOptions = useLoadUserSkill(experienceToHandle);
    const onSubmit = useHandleSubmit({onClose});
    const resetItems = useMemo(() => mapExperienceToForm(experienceToHandle), [experienceToHandle]);
     
    const items = useMemo(() => [
        {as: 'Input', name: 'companyName', label: 'Company', placeholder: 'Google'},
        {as: 'Input', name: 'jobTitle', label: 'Job title', placeholder: 'Software Developer'},
        {as: 'Input', name: 'startDate', label: 'Start date', type: 'Date'},
        {as: 'Input', name: 'endDate', label: 'End date', type: 'Date'},
        {as: 'Checkbox', name: 'isWorking', label: 'Still working?'},
        {as: 'Input', name: 'location', label: 'Location', placeholder: 'Champs-Élysées St - Paris'},
        {as: 'Input', name: 'description', label: 'Description', placeholder: 'Description', type: 'Textarea'},
        {as: 'DropdownMulti', name: 'lstSkills', options: skillOptions, label: 'Skills', fetchAction: skillListQuery, isLoading: skillLoading}
    ], [ skillOptions ]);

    return (
        <ControlledForm
            schema={experienceSchema}
            onSubmit={onSubmit}
            items={items as any}
            error={error}
            loading={loading}
            defaultValues={{isStudying: false}}
            watch={{
                name: 'isWorking',
                defaultValue: false,
                watched: 'endDate'
            }}
            resetItems= {resetItems as any}
            indicator={indicator}
        />
    );
}