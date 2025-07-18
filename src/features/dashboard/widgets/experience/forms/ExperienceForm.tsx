'use client';

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { addEditExperience, experienceListQuery } from "@/features/dashboard/widgets/experience/apis";
import { ControlledForm } from "@/components/ui/form";
import { useMemo } from "react";
import { ExperienceProps } from "../types";
import { ExperienceFormData, experienceSchema } from "../schema";

export const ExperienceForm = ({id, onClose} : ExperienceProps) => {

    const dispatch = useAppDispatch();
    const { loading, error, lstExperiences } = useAppSelector((state) => state.experience);
    const experienceToHandle = useMemo(() => lstExperiences.find((ex: any) => ex.id === id), [lstExperiences])
    const indicator = id ? {when: 'Update', while: 'Updating...'} : {when: 'Create', while: 'creating...'};

    const onSubmit = async (data: ExperienceFormData) => {
        const resultAction = await dispatch(addEditExperience(data));

        if (!addEditExperience.rejected.match(resultAction)) {
            await dispatch(experienceListQuery());
            onClose?.();
        }
    };

    const items = useMemo(() => [
        {as: 'Input', name: 'companyName', label: 'Company', placeholder: 'Google'},
        {as: 'Input', name: 'jobTitle', label: 'Job title', placeholder: 'Software Developer'},
        {as: 'Input', name: 'startDate', label: 'Start date', type: 'Date'},
        {as: 'Input', name: 'endDate', label: 'End date', type: 'Date'},
        {as: 'Checkbox', name: 'isWorking', label: 'Still working?'},
        {as: 'Input', name: 'location', label: 'Location', placeholder: 'Champs-Élysées St - Paris'},
        {as: 'Input', name: 'description', label: 'Description', placeholder: 'Description', type: 'Textarea'}
    ], []);

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
            resetItems={experienceToHandle as any}
            indicator={indicator}
        />
    );
}