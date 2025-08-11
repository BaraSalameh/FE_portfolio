'use client';

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { addEditExperience, experienceListQuery } from "@/features/dashboard/widgets/experience/apis";
import { ControlledForm } from "@/components/forms";
import { useEffect, useMemo, useState } from "react";
import { ExperienceProps } from "../types.experience";
import { ExperienceFormData, experienceSchema } from "../schema";
import { Option } from "@/features/types.features";
import { mapExperienceToForm, mergeOptions, optionsCreator } from "@/lib/utils";
import { skillListQuery } from "../../skill";

export const ExperienceForm = ({id, onClose} : ExperienceProps) => {

    const dispatch = useAppDispatch();
    const { loading: skillLoading, lstSkills } = useAppSelector((state) => state.userSkill.skill);
    const { loading, error, lstExperiences } = useAppSelector((state) => state.experience);
    const experienceToHandle = useMemo(() => lstExperiences.find(ex => ex.id === id), [lstExperiences])
    const indicator = id ? {when: 'Update', while: 'Updating...'} : {when: 'Create', while: 'creating...'};

    const [ skillOptions, setSkillOptions ] = useState<Option[]>([]);

    const onSubmit = async (data: ExperienceFormData) => {
        const resultAction = await dispatch(addEditExperience(data));

        if (!addEditExperience.rejected.match(resultAction)) {
            await dispatch(experienceListQuery());
            onClose?.();
        }
    };

     useEffect(() => {
            const { lstSkills: lsfe } = experienceToHandle ?? {};
            const skillsFromEdit = lsfe ? optionsCreator({list: lsfe, iconKey: 'iconUrl'}) : [];
            const skillsStore = optionsCreator({list: lstSkills, iconKey: 'iconUrl'});
            setSkillOptions(mergeOptions(skillsFromEdit, skillsStore));
    
        }, [experienceToHandle, lstSkills]);

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

    const resetItems = useMemo(
        () => mapExperienceToForm(experienceToHandle),
    [experienceToHandle]);

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