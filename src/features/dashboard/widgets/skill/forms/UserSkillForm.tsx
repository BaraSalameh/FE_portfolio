'use client';

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { useEffect, useMemo, useState } from "react";
import { mapUserSkillToForm, mergeOptions, optionsCreator } from "@/lib/utils";
import { ControlledForm } from "@/components/forms";
import { Option } from "@/features/types.features";
import { SkillProps } from "../types.skill";
import { UserSkillFormData, userSkillSchema } from "../schema";
import { editDeleteUserSkill, skillListQuery, userSkillListQuery } from "../apis";
import { FormField } from "@/components/forms/types.forms";

export const UserSkillForm = ({id, onClose} : SkillProps) => {

    const dispatch = useAppDispatch();
    const { loading, error, lstUserSkills, skill } = useAppSelector((state) => state.userSkill);
    const { loading: skillLoading, lstSkills } = skill;
    const { lstEducations } = useAppSelector(state => state.education);
    const { lstExperiences } = useAppSelector(state => state.experience);
    const { lstProjectTechnologies } = useAppSelector(state => state.projectTechnology);
    
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
    
    const onSubmit = async (data: UserSkillFormData) => {
        const resultAction = await dispatch(editDeleteUserSkill(data));
        
        if (!editDeleteUserSkill.rejected.match(resultAction)) {
            await dispatch(userSkillListQuery());
            onClose?.();
        }
    };
    
    const [ skillOptions, setSkillOptions ] = useState<Option[]>([]);
    
    useEffect(() => {
        const skillsFromEdit = optionsCreator({list: lstUserSkills, labelKey: 'skill.name', valueKey: 'skill.id', iconKey: 'skill.iconUrl'});
        const skillStore = optionsCreator({list: lstSkills, iconKey: 'iconUrl'});
        setSkillOptions(mergeOptions(skillsFromEdit, skillStore));
        
    }, [lstUserSkills, lstSkills]);

    const fieldConfigs: FormField[] = useMemo(() => [
        {as: 'Dropdown', label: 'Skills', name: 'LKP_SkillID', options: skillOptions, fetchAction: skillListQuery, isLoading: skillLoading},
        {as: 'Dropdown', label: 'Corresponding education', name: 'EducationID', options: educationOptions},
        {as: 'Dropdown', label: 'Corresponding experience', name: 'ExperienceID', options: experienceOptions},
        {as: 'Dropdown', label: 'Corresponding Project', name: 'ProjectID', options: projectOptions},
        {as: 'Dropdown', label: 'Corresponding Certificate', name: 'CertificateID', options: projectOptions}
    ], [skillOptions, educationOptions, experienceOptions, projectOptions, skillLoading]);

    const resetItems = useMemo(
        () => mapUserSkillToForm(lstUserSkills),
    [lstUserSkills]);

    return (
        <ControlledForm
            schema={userSkillSchema}
            onSubmit={onSubmit}
            items={[{as: 'FieldArray', name: 'lstUserSkills', fields: fieldConfigs}]}
            error={error}
            loading={loading}
            resetItems={resetItems as any}
            indicator={{when: 'Update', while: 'Updating...'}}
        />
    );
}