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
    const { lstProjects } = useAppSelector(state => state.project);
    const { lstCertificates } = useAppSelector(state => state.certificate);
    
    const educationOptions = useMemo(() =>
        // Didn't use OptionCreator because the label is a combination of paths
        lstEducations.map((i: any) => ({ label: `${i.institution.name} (${i.degree.abbreviation})`, value: i.id, icon: i.icon }))
    , [lstEducations]);
    
    const experienceOptions = useMemo(() =>
        optionsCreator({list: lstExperiences, labelKey: 'companyName'})
    , [lstExperiences]);
    
    const projectOptions = useMemo(() =>
        optionsCreator({list: lstProjects, labelKey: 'title'})
    , [lstProjects]);

    const certificateOptions = useMemo(() =>
        optionsCreator({list: lstCertificates, labelKey: 'certificate.name'})
    , [lstCertificates]);
    
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
        {as: 'DropdownMulti', label: 'Corresponding education', name: 'EducationIDs', options: educationOptions},
        {as: 'DropdownMulti', label: 'Corresponding experience', name: 'ExperienceIDs', options: experienceOptions},
        {as: 'DropdownMulti', label: 'Corresponding Project', name: 'ProjectIDs', options: projectOptions},
        {as: 'DropdownMulti', label: 'Corresponding Certificate', name: 'CertificateIDs', options: certificateOptions}
    ], [skillOptions, educationOptions, experienceOptions, projectOptions, certificateOptions, skillLoading]);

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