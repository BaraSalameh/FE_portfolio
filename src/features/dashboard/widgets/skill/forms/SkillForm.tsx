'use client';

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { useEffect, useMemo, useState } from "react";
import { mapSkillToForm, mergeOptions, optionsCreator } from "@/lib/utils";
import { ControlledForm } from "@/components/forms";
import { Option } from "@/features/types.features";
import { SkillProps } from "../types.skill";
import { editDeleteSkill, lkpSkillListQuery, skillListQuery } from "../apis";
import { SkillFormData, skillSchema } from "../schema";

export const SkillForm = ({id, onClose} : SkillProps) => {

    const dispatch = useAppDispatch();
    const { loading, error, lstSkills: userSkills, lkpSkill } = useAppSelector((state) => state.skill);
    const { loading: skillLoading, lstSkills } = lkpSkill;
    const { lstEducations } = useAppSelector(state => state.education);
    const { lstExperiences } = useAppSelector(state => state.experience);
    const { lstProjectTechnologies } = useAppSelector(state => state.projectTechnology);
    const indicator = id ? {when: 'Update', while: 'Updating...'} : {when: 'Create', while: 'creating...'};
    
    const [ skillOptions, setSkillOptions ] = useState<Option[]>([]);

    const educationOptions = useMemo(() =>
        // Didn't use OptionCreator because the label is a combination of paths
        lstEducations.map((i: any) => ({ label: `${i.institution.name} (${i.degree.abbreviation})`, value: i.id, icon: i.icon }))
    , [lstEducations]);

    const experienceOptions = useMemo(() =>
        optionsCreator({list: lstExperiences, labelKey: 'companyName'})
    , [lstEducations]);

    const projectOptions = useMemo(() =>
        optionsCreator({list: lstProjectTechnologies, labelKey: 'title'})
    , [lstProjectTechnologies]);

    const onSubmit = async (data: SkillFormData) => {
        const resultAction = await dispatch(editDeleteSkill(data));

        if (!editDeleteSkill.rejected.match(resultAction)) {
            await dispatch(skillListQuery());
            onClose?.();
        }
    };

    const fieldConfigs = useMemo(() => [
        {label: 'Skills', name: 'lkP_SkillID', options: skillOptions, fetchAction: lkpSkillListQuery, isLoading: skillLoading},
        {label: 'Corresponding education', name: 'EducationID', options: educationOptions},
        {label: 'Corresponding experience', name: 'ExperienceID', options: experienceOptions},
        {label: 'Corresponding Project', name: 'projectID', options: projectOptions},
        {as: 'Input', name: 'proficiency', label: 'Proficiency', type: 'number', placeholder: '1-100'},
        {as: 'Input', name: 'description', label: 'Description', placeholder: 'Description', type: 'Textarea'}
        
    ], [lkpSkillListQuery, educationOptions, experienceOptions, projectOptions, skillLoading]);
    
    const items = useMemo(() => [
        {as: 'FieldArray', name: 'lstSkills', fields: fieldConfigs},
    ], [fieldConfigs]);

    const resetItems = useMemo(
        () => mapSkillToForm(userSkills),
    [userSkills]);

    useEffect(() => {
        const skillsFromEdit = optionsCreator({list: userSkills, labelKey: 'skill.name', valueKey: 'skill.id', iconKey: 'skill.iconUrl'});
        const skillStore = optionsCreator({list: lstSkills, iconKey: 'iconUrl'});
        setSkillOptions(mergeOptions(skillsFromEdit, skillStore));
        
    }, [userSkills, lstSkills]);

    return (
        <ControlledForm
            schema={skillSchema}
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