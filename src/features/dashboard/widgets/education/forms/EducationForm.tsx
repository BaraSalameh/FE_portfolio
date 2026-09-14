'use client';

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useCallback, useMemo } from "react";
import { mapEducationToForm } from "@/lib/utils";
import { ControlledForm } from '@/features/dashboard/forms';
import { EducationProps } from "../types.education";
import { educationSchema } from "../schema";
import { createFieldOfStudy, degreeListQuery, fieldOfStudyListQuery, institutionListQuery } from "../thunks";
import { skillListQuery } from "../../skill";
import { useLoadInstitution, useLoadDegree, useLoadFieldOfStudy, useHandleSubmit } from "../hooks";
import { useLoadUserSkill } from "@/features/dashboard/hooks";
import { FormItem } from '@/features/dashboard/forms/types.forms';

export const EducationForm = ({id, onClose} : EducationProps) => {

    const dispatch = useAppDispatch();

    const { loading, error, lstEducations, institution, degree, fieldOfStudy } = useAppSelector((state) => state.education);
    const { loading: skillLoading } = useAppSelector((state) => state.userSkill.skill);
    const { loading: institutionLoading } = institution;
    const { loading: degreeLoading } = degree;
    const { loading: fieldLoading } = fieldOfStudy;

    const educationToHandle = useMemo(() => lstEducations.find(ed => ed.id === id), [id, lstEducations]);
    const indicator = id ? {when: 'Update', while: 'Updating...'} : {when: 'Create', while: 'creating...'};
    
    const institutionOptions = useLoadInstitution(educationToHandle);
    const degreeOptions = useLoadDegree(educationToHandle);
    const fieldOfStudyOptions = useLoadFieldOfStudy(educationToHandle);
    const skillOptions = useLoadUserSkill(educationToHandle);
    const onSubmit = useHandleSubmit({onClose});
    const resetItems = useMemo(() => mapEducationToForm(educationToHandle), [educationToHandle]);
    const createFieldOption = useCallback(async (name: string) => {
        const field = await dispatch(createFieldOfStudy(name)).unwrap();
        return { label: field.name, value: field.id, badge: field.source ?? undefined };
    }, [dispatch]);

    const items = useMemo<FormItem<typeof educationSchema>[]>(() => [
        {as: 'Dropdown', name: 'LKP_InstitutionID', options: institutionOptions, label: 'Institution', fetchAction: institutionListQuery, isLoading: institutionLoading},
        {as: 'Dropdown', name: 'LKP_DegreeID', options: degreeOptions, label: 'Degree', fetchAction: degreeListQuery, isLoading: degreeLoading, minimumSearchLength: 0, loadOptionsOnMount: true},
        {as: 'Dropdown', name: 'LKP_FieldOfStudyID', options: fieldOfStudyOptions, label: 'Field of study', fetchAction: fieldOfStudyListQuery, isLoading: fieldLoading, minimumSearchLength: 0, loadOptionsOnMount: true, createOption: createFieldOption},
        {as: 'Input', name: 'startDate', label: 'Start date', type: 'Date'},
        {as: 'Input', name: 'endDate', label: 'End date', type: 'Date'},
        {as: 'Checkbox', name: 'isStudying', label: 'Still studying?'},
        {as: 'Input', name: 'description', label: 'Description', description: 'Optional. Summarize relevant coursework, activities, or achievements.', placeholder: 'Relevant coursework and achievements', type: 'Textarea'},
        {as: 'DropdownMulti', name: 'lstSkills', options: skillOptions, label: 'Skills', fetchAction: skillListQuery, isLoading: skillLoading}
    ], [ institutionOptions, degreeOptions, fieldOfStudyOptions, institutionLoading, degreeLoading, fieldLoading, skillOptions, skillLoading, createFieldOption ]);
    
    return (
        <ControlledForm
            schema={educationSchema}
            onSubmit={onSubmit}
            items={items}
            error={error}
            loading={loading}
            defaultValues={{isStudying: false}}
            watch={{
                name: 'isStudying',
                defaultValue: false,
                watched: 'endDate'
            }}
            resetItems={resetItems}
            indicator={indicator}
        />
    );
}
