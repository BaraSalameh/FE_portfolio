'use client';

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { useEffect, useMemo, useState } from "react";
import { mapEducationToForm, mergeOptions, optionsCreator } from "@/lib/utils";
import { ControlledForm } from "@/components/forms";
import { Option } from "@/features/types.features";
import { EducationProps } from "../types.education";
import { EducationFormData, educationSchema } from "../schema";
import { addEditEducation, degreeListQuery, educationListQuery, fieldOfStudyListQuery, institutionListQuery } from "../apis";
import { skillListQuery } from "../../skill";

export const EducationForm = ({id, onClose} : EducationProps) => {

    const dispatch = useAppDispatch();
    const { loading: skillLoading, lstSkills } = useAppSelector((state) => state.userSkill.skill);
    const { loading, error, lstEducations, institution, degree, fieldOfStudy } = useAppSelector((state) => state.education);
    const { loading: institutionLoading, lstInstitutions } = institution;
    const { loading: degreeLoading, lstDegrees } = degree;
    const { loading: fieldLoading, lstFields } = fieldOfStudy;
    const educationToHandle = lstEducations.find(ed => ed.id === id);

    const indicator = id ? {when: 'Update', while: 'Updating...'} : {when: 'Create', while: 'creating...'};

    const [ institutionOptions, setInstitutionOptions ] = useState<Option[]>([]);
    const [ degreeOptions, setDegreeOptions ] = useState<Option[]>([]);
    const [ fieldOfStudyOptions, setFieldOfStudyOptions ] = useState<Option[]>([]);
    const [ skillOptions, setSkillOptions ] = useState<Option[]>([]);

    const onSubmit = async (data: EducationFormData) => {
        const resultAction = await dispatch(addEditEducation(data));

        if (!addEditEducation.rejected.match(resultAction)) {
            await dispatch(educationListQuery());
            onClose?.();
        }
    };

    useEffect(() => {
        const { institution, degree, fieldOfStudy } = educationToHandle ?? {};
        const institutionFromEdit = optionsCreator({list: institution });
        const degreeFromEdit = optionsCreator({list: degree});
        const fieldOfStudyFromEdit = optionsCreator({list: fieldOfStudy});

        const institutionFromStore = optionsCreator({list: lstInstitutions});
        const degreeFromStore = optionsCreator({list: lstDegrees});
        const fieldOfStudyFromStore = optionsCreator({list: lstFields});

        setInstitutionOptions(mergeOptions(institutionFromEdit, institutionFromStore));
        setDegreeOptions(mergeOptions(degreeFromEdit, degreeFromStore));
        setFieldOfStudyOptions(mergeOptions(fieldOfStudyFromEdit, fieldOfStudyFromStore));
    }, [educationToHandle, lstInstitutions, lstDegrees, lstFields]);

    useEffect(() => {
        const { lstSkills: lsfe } = educationToHandle ?? {};
        const skillsFromEdit = lsfe ? optionsCreator({list: lsfe, iconKey: 'iconUrl'}) : [];
        const skillsStore = optionsCreator({list: lstSkills, iconKey: 'iconUrl'});
        setSkillOptions(mergeOptions(skillsFromEdit, skillsStore));

    }, [educationToHandle, lstSkills]);

    const items = useMemo(() => [
        {as: 'Dropdown', name: 'LKP_InstitutionID', options: institutionOptions, label: 'Institution', fetchAction: institutionListQuery, isLoading: institutionLoading},
        {as: 'Dropdown', name: 'LKP_DegreeID', options: degreeOptions, label: 'Degree', fetchAction: degreeListQuery, isLoading: degreeLoading},
        {as: 'Dropdown', name: 'LKP_FieldOfStudyID', options: fieldOfStudyOptions, label: 'Field of study', fetchAction: fieldOfStudyListQuery, isLoading: fieldLoading},
        {as: 'Input', name: 'startDate', label: 'Start date', type: 'Date'},
        {as: 'Input', name: 'endDate', label: 'End date', type: 'Date'},
        {as: 'Checkbox', name: 'isStudying', label: 'Still studying?'},
        {as: 'DropdownMulti', name: 'lstSkills', options: skillOptions, label: 'Skills', fetchAction: skillListQuery, isLoading: skillLoading}
    ], [institutionOptions, degreeOptions, fieldOfStudyOptions, institutionLoading, degreeLoading, fieldLoading, skillOptions]);
    
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