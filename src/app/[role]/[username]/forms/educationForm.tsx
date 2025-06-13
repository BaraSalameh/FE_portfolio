'use client';

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { EducationFormData, educationSchema } from "@/lib/schemas";
import { useEffect, useState } from "react";
import { institutionListQuery, degreeListQuery, fieldOfStudyListQuery, addEditEducation, educationListQuery } from "@/lib/apis";
import { mapEducationToForm, mergeOptions } from "@/lib/utils/appFunctions";
import { EducationProps } from "../types";
import { ControlledForm } from "@/components/ui/form";
import { Option } from "@/components/ui/form/types";

const EducationForm = ({id, onClose} : EducationProps) => {

    const dispatch = useAppDispatch();
    const { loading, error, lstEducations, lstInstitutions, lstDegrees, lstFields } = useAppSelector((state) => state.education);
    const educationToHandle: any = lstEducations.find(ed => ed.id === id);

    const indicator = id ? {when: 'Update', while: 'Updating...'} : {when: 'Create', while: 'creating...'};

    const [ institutionOptions, setInstitutionOptions ] = useState<Option[]>([]);
    const [ degreeOptions, setDegreeOptions ] = useState<Option[]>([]);
    const [ fieldOfStudyOptions, setFieldOfStudyOptions ] = useState<Option[]>([]);

    const onSubmit = async (data: EducationFormData) => {
        const resultAction = await dispatch(addEditEducation(data));

        if (!addEditEducation.rejected.match(resultAction)) {
            await dispatch(educationListQuery());
            onClose?.();
        }
    };

    useEffect(() => {
        const { institution, degree, fieldOfStudy } = educationToHandle ?? {};
        const institutionFromEdit = institution ? [{ label: institution.name, value: institution.id }] : [];
        const degreeFromEdit = degree ? [{ label: degree.name, value: degree.id }] : [];
        const fieldOfStudyFromEdit = fieldOfStudy ? [{ label: fieldOfStudy.name, value: fieldOfStudy.id }] : [];

        const institutionFromStore = lstInstitutions.map(i => ({ label: i.name, value: i.id }));
        const degreeFromStore = lstDegrees.map(d => ({ label: d.name, value: d.id }));
        const fieldOfStudyFromStore = lstFields.map(f => ({ label: f.name, value: f.id }));

        setInstitutionOptions(mergeOptions(institutionFromEdit, institutionFromStore));
        setDegreeOptions(mergeOptions(degreeFromEdit, degreeFromStore));
        setFieldOfStudyOptions(mergeOptions(fieldOfStudyFromEdit, fieldOfStudyFromStore));
    }, [educationToHandle, lstInstitutions, lstDegrees, lstFields]);

    return (
        <ControlledForm
            schema={educationSchema}
            onSubmit={onSubmit}
            items={[
                {as: 'Dropdown', name: 'LKP_InstitutionID', options: institutionOptions, label: 'Institution', fetchAction: institutionListQuery, isLoading: loading},
                {as: 'Dropdown', name: 'LKP_DegreeID', options: degreeOptions, label: 'Degree', fetchAction: degreeListQuery, isLoading: loading},
                {as: 'Dropdown', name: 'LKP_FieldOfStudyID', options: fieldOfStudyOptions, label: 'Field of study', fetchAction: fieldOfStudyListQuery, isLoading: loading},
                {as: 'Input', name: 'startDate', label: 'Start date', type: 'Date'},
                {as: 'Input', name: 'endDate', label: 'End date', type: 'Date'},
                {as: 'Checkbox', name: 'isStudying', label: 'Still studying?'},
            ]}
            error={error}
            loading={loading}
            defaultValues={{isStudying: false}}
            watch={{
                name: 'isStudying',
                defaultValue: false,
                watched: 'endDate'
            }}
            resetItems={mapEducationToForm(educationToHandle) as any}
            indicator={indicator}
        />
    );
}

export default EducationForm;