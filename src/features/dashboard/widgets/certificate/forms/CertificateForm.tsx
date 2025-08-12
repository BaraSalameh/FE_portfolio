'use client';

import { useAppSelector } from "@/lib/store/hooks";
import { useMemo } from "react";
import { mapCertificateToForm } from "@/lib/utils";
import { ControlledForm, ImageUploader } from "@/components/forms";
import { CertificateProps } from "../types.certificate";
import { certificateSchema } from "../schema";
import { lkp_CertificateListQuery } from "../apis";
import { skillListQuery } from "../../skill";
import { useHandleSubmit, useLoadCertificate } from "../hooks";
import { useLoadUserSkill } from "@/features/dashboard/hooks";

export const CertificateForm = ({id, onClose} : CertificateProps) => {

    const { loading, error, lstCertificates: lstUserCertificate, certificate } = useAppSelector((state) => state.certificate);
    const { loading: skillLoading } = useAppSelector((state) => state.userSkill.skill);
    const { loading: certificateLoading } = certificate;

    const certificateToHandle = lstUserCertificate.find(c => c.id === id);
    const indicator = id ? {when: 'Update', while: 'Updating...'} : {when: 'Create', while: 'creating...'};
    
    const certificateOptions = useLoadCertificate(certificateToHandle);
    const skillOptions = useLoadUserSkill(certificateToHandle);
    const onSubmit = useHandleSubmit({onClose});
    const resetItems = useMemo(() => mapCertificateToForm(certificateToHandle), [certificateToHandle]);

    const items = useMemo(() => [
        {as: 'DropdownMulti', name: 'lstSkills', options: skillOptions, label: 'Skills', fetchAction: skillListQuery, isLoading: skillLoading},
        {as: 'Dropdown', name: 'LKP_CertificateID', options: certificateOptions, label: 'Certificate', fetchAction: lkp_CertificateListQuery, isLoading: certificateLoading},
        {as: 'Input', name: 'issueDate', label: 'Issue Date', type: 'Date'},
        {as: 'Input', name: 'expirationDate', label: 'Expiration Date', type: 'Date'},
        {as: 'Input', name: 'credintialID', label: 'Credintial ID', placeholder: 'xxx-xxxx-xxx-xx'},
        {as: 'Input', name: 'credintialUrl', label: 'Credintial Url', placeholder: 'https://MyCredintial'},
        {
            as: 'Modal',
            name: 'lstCertificateMedias',
            modal: {
                as: 'update',
                children: <ImageUploader preset="Cover_Photo"/>,
                title:'Add Media',
                subTitle: 'Choose a new media'
            }
        },
    ], [skillOptions, certificateOptions, skillLoading, certificateLoading]);

    return (
        <ControlledForm
            schema={certificateSchema}
            onSubmit={onSubmit}
            items={items as any}
            error={error}
            loading={loading}
            resetItems={resetItems as any}
            indicator={indicator}
        />
    );
}