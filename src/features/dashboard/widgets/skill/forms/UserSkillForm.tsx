'use client';

import { useAppSelector } from "@/lib/store/hooks";
import { useMemo } from "react";
import { mapUserSkillToForm, optionsCreator } from "@/lib/utils";
import { ControlledForm } from "@/components/forms";
import { SkillProps } from "../types.skill";
import { userSkillSchema } from "../schema";
import { skillListQuery } from "../apis";
import { FormField } from "@/components/forms/types.forms";
import { useLoadUserSkill } from "@/features/dashboard/hooks";
import { useHandleSubmit } from "../hooks";

export const UserSkillForm = ({ onClose } : SkillProps) => {

    const { loading, error, lstUserSkills, skill } = useAppSelector((state) => state.userSkill);
    const { loading: skillLoading } = skill;
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
    
    const skillOptions = useLoadUserSkill(lstUserSkills);
    const onSubmit = useHandleSubmit({onClose});
    const resetItems = useMemo(() => mapUserSkillToForm(lstUserSkills), [lstUserSkills]);

    const fieldConfigs: FormField[] = useMemo(() => [
        {as: 'Dropdown', label: 'Skills', name: 'LKP_SkillID', options: skillOptions, fetchAction: skillListQuery, isLoading: skillLoading},
        {as: 'DropdownMulti', label: 'Corresponding education', name: 'EducationIDs', options: educationOptions},
        {as: 'DropdownMulti', label: 'Corresponding experience', name: 'ExperienceIDs', options: experienceOptions},
        {as: 'DropdownMulti', label: 'Corresponding Project', name: 'ProjectIDs', options: projectOptions},
        {as: 'DropdownMulti', label: 'Corresponding Certificate', name: 'CertificateIDs', options: certificateOptions}
    ], [skillOptions, educationOptions, experienceOptions, projectOptions, certificateOptions, skillLoading]);

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