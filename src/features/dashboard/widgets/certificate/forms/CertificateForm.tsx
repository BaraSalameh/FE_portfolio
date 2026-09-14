'use client';

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useCallback, useMemo } from "react";
import { mapCertificateToForm } from "@/lib/utils";
import { ControlledForm, ImageUploader } from '@/features/dashboard/forms';
import { CertificateProps } from "../types.certificate";
import { certificateSchema } from "../schema";
import { createCertificate, lkp_CertificateListQuery } from "../thunks";
import { createSkill, skillListQuery } from "../../skill";
import { useHandleSubmit, useLoadCertificate } from "../hooks";
import { useLoadUserSkill } from "@/features/dashboard/hooks";
import { FormItem } from '@/features/dashboard/forms/types.forms';

export const CertificateForm = ({id, onClose} : CertificateProps) => {

    const dispatch = useAppDispatch();

    const { loading, error, lstCertificates: lstUserCertificate, certificate } = useAppSelector((state) => state.certificate);
    const { loading: skillLoading } = useAppSelector((state) => state.userSkill.skill);
    const { loading: certificateLoading } = certificate;

    const certificateToHandle = lstUserCertificate.find(c => c.id === id);
    const indicator = id ? {when: 'Update', while: 'Updating...'} : {when: 'Create', while: 'creating...'};
    
    const certificateOptions = useLoadCertificate(certificateToHandle);
    const skillOptions = useLoadUserSkill(certificateToHandle);
    const onSubmit = useHandleSubmit({onClose});
    const resetItems = useMemo(() => mapCertificateToForm(certificateToHandle), [certificateToHandle]);
    const createCertificateOption = useCallback(async (name: string) => {
        const created = await dispatch(createCertificate(name)).unwrap();
        return { label: created.name, value: created.id };
    }, [dispatch]);
    const createSkillOption = useCallback(async (name: string) => {
        const created = await dispatch(createSkill(name)).unwrap();
        return { label: created.name, value: created.id, icon: created.iconUrl, badge: created.source ?? undefined };
    }, [dispatch]);

    const items = useMemo<FormItem<typeof certificateSchema>[]>(() => [
        {as: 'Dropdown', name: 'LKP_CertificateID', options: certificateOptions, label: 'Certificate', fetchAction: lkp_CertificateListQuery, isLoading: certificateLoading, minimumSearchLength: 3, createOption: createCertificateOption},
        {as: 'Input', name: 'issueDate', label: 'Issue Date', type: 'Date'},
        {as: 'Input', name: 'expirationDate', label: 'Expiration Date', type: 'Date'},
        {as: 'Input', name: 'credintialID', label: 'Credential ID', placeholder: 'XXX-XXXX-XXX'},
        {as: 'Input', name: 'credintialUrl', label: 'Credential URL', placeholder: 'https://example.com/credential'},
        {as: 'DropdownMulti', name: 'lstSkills', options: skillOptions, label: 'Skills', fetchAction: skillListQuery, isLoading: skillLoading, createOption: createSkillOption},
        {
            as: 'MediaUpload',
            name: 'lstCertificateMedias',
            label: 'Certificate media',
            description: 'Attach a clear image of the certificate or credential.',
            media: certificateToHandle?.lstCertificateMedias ?? [],
            uploader: <ImageUploader preset="Certificate_Media"/>,
        },
    ], [skillOptions, certificateOptions, skillLoading, certificateLoading, createCertificateOption, createSkillOption, certificateToHandle]);

    return (
        <ControlledForm
            schema={certificateSchema}
            onSubmit={onSubmit}
            items={items}
            error={error}
            loading={loading}
            resetItems={resetItems}
            indicator={indicator}
        />
    );
}
