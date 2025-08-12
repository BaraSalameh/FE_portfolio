'use client';

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { useMemo } from "react";
import { mapEducationToForm } from "@/lib/utils";
import { ControlledForm } from "@/components/forms";
import { EducationProps } from "../types.education";
import { educationSchema } from "../schema";
import { degreeListQuery, fieldOfStudyListQuery, institutionListQuery } from "../apis";
import { skillListQuery } from "../../skill";
import { useLoadInstitution, useLoadDegree, useLoadFieldOfStudy, useHandleSubmit } from "../hooks";
import { useLoadUserSkill } from "@/features/dashboard/hooks";

export const EducationForm = ({id, onClose} : EducationProps) => {

    const { loading, error, lstEducations, institution, degree, fieldOfStudy } = useAppSelector((state) => state.education);
    const { loading: skillLoading } = useAppSelector((state) => state.userSkill.skill);
    const { loading: institutionLoading } = institution;
    const { loading: degreeLoading } = degree;
    const { loading: fieldLoading } = fieldOfStudy;

    const educationToHandle = useMemo(() => lstEducations.find(ed => ed.id === id), [lstEducations]);
    const indicator = id ? {when: 'Update', while: 'Updating...'} : {when: 'Create', while: 'creating...'};
    
    const institutionOptions = useLoadInstitution(educationToHandle);
    const degreeOptions = useLoadDegree(educationToHandle);
    const fieldOfStudyOptions = useLoadFieldOfStudy(educationToHandle);
    const skillOptions = useLoadUserSkill(educationToHandle);
    const onSubmit = useHandleSubmit({onClose});
    const resetItems = useMemo(() => mapEducationToForm(educationToHandle), [educationToHandle]);

    const items = useMemo(() => [
        {as: 'Dropdown', name: 'LKP_InstitutionID', options: institutionOptions, label: 'Institution', fetchAction: institutionListQuery, isLoading: institutionLoading},
        {as: 'Dropdown', name: 'LKP_DegreeID', options: degreeOptions, label: 'Degree', fetchAction: degreeListQuery, isLoading: degreeLoading},
        {as: 'Dropdown', name: 'LKP_FieldOfStudyID', options: fieldOfStudyOptions, label: 'Field of study', fetchAction: fieldOfStudyListQuery, isLoading: fieldLoading},
        {as: 'Input', name: 'startDate', label: 'Start date', type: 'Date'},
        {as: 'Input', name: 'endDate', label: 'End date', type: 'Date'},
        {as: 'Checkbox', name: 'isStudying', label: 'Still studying?'},
        {as: 'DropdownMulti', name: 'lstSkills', options: skillOptions, label: 'Skills', fetchAction: skillListQuery, isLoading: skillLoading}
    ], [ institutionOptions, degreeOptions, fieldOfStudyOptions, institutionLoading, degreeLoading, fieldLoading, skillOptions ]);
    
    return (
        <ControlledForm
            schema={educationSchema}
            onSubmit={onSubmit}
            items={items as any}
            error={error}
            loading={loading}
            defaultValues={{isStudying: false}}
            watch={{
                name: 'isStudying',
                defaultValue: false,
                watched: 'endDate'
            }}
            resetItems={resetItems as any}
            indicator={indicator}
        />
    );
}