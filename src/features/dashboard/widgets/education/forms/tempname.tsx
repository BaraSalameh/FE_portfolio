'use client';
// EducationForm
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { useEffect, useMemo, useState } from "react";
import { mapEducationToForm, mergeOptions, OptionsCreator } from "@/lib/utils/appFunctions";
import { ControlledForm } from "@/components/ui/form";
import { Option } from "@/components/ui/form/types";
import { EducationProps } from "../types";
import { EducationFormData, educationSchema } from "../schema";
import { addEditEducation, degreeListQuery, educationListQuery, fieldOfStudyListQuery, institutionListQuery } from "../apis";

export const EducationForm = ({id, onClose} : EducationProps) => {

    const dispatch = useAppDispatch();
    const { loading, error, lstEducations, institution, degree, fieldOfStudy } = useAppSelector((state) => state.education);
    const { loading: institutionLoading, lstInstitutions } = institution;
    const { loading: degreeLoading, lstDegrees } = degree;
    const { loading: fieldLoading, lstFields } = fieldOfStudy;
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
        const institutionFromEdit = OptionsCreator({list: institution });
        const degreeFromEdit = OptionsCreator({list: degree});
        const fieldOfStudyFromEdit = OptionsCreator({list: fieldOfStudy});

        const institutionFromStore = OptionsCreator({list: lstInstitutions});
        const degreeFromStore = OptionsCreator({list: lstDegrees});
        const fieldOfStudyFromStore = OptionsCreator({list: lstFields});

        setInstitutionOptions(mergeOptions(institutionFromEdit, institutionFromStore));
        setDegreeOptions(mergeOptions(degreeFromEdit, degreeFromStore));
        setFieldOfStudyOptions(mergeOptions(fieldOfStudyFromEdit, fieldOfStudyFromStore));
    }, [educationToHandle, lstInstitutions, lstDegrees, lstFields]);

    const items = useMemo(() => [
        {as: 'Dropdown', name: 'LKP_InstitutionID', options: institutionOptions, label: 'Institution', fetchAction: institutionListQuery, isLoading: institutionLoading},
        {as: 'Dropdown', name: 'LKP_DegreeID', options: degreeOptions, label: 'Degree', fetchAction: degreeListQuery, isLoading: degreeLoading},
        {as: 'Dropdown', name: 'LKP_FieldOfStudyID', options: fieldOfStudyOptions, label: 'Field of study', fetchAction: fieldOfStudyListQuery, isLoading: fieldLoading},
        {as: 'Input', name: 'startDate', label: 'Start date', type: 'Date'},
        {as: 'Input', name: 'endDate', label: 'End date', type: 'Date'},
        {as: 'Checkbox', name: 'isStudying', label: 'Still studying?'}
    ], [institutionOptions, degreeOptions, fieldOfStudyOptions, institutionLoading, degreeLoading, fieldLoading]);
    
    const resetItems = useMemo(
        () => mapEducationToForm(educationToHandle),
    [educationToHandle]);

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