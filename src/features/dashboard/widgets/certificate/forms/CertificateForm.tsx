'use client';

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { useEffect, useMemo, useState } from "react";
import { mapCertificateToForm, mergeOptions, optionsCreator } from "@/lib/utils";
import { ControlledForm, ImageUploader } from "@/components/forms";
import { Option } from "@/features/types.features";
import { CertificateProps } from "../types.certificate";
import { CertificateFormData, certificateSchema } from "../schema";
import { addEditCertificate, certificateListQuery, lkp_CertificateListQuery } from "../apis";
import { skillListQuery } from "../../skill";

export const CertificateForm = ({id, onClose} : CertificateProps) => {

    const dispatch = useAppDispatch();
    const { loading, error, lstCertificates: lstUserCertificate, certificate } = useAppSelector((state) => state.certificate);
    const { loading: certificateLoading, lstCertificates } = certificate;
    const { loading: skillLoading, lstSkills } = useAppSelector((state) => state.userSkill.skill);

    const certificateToHandle: any = lstUserCertificate.find((pt: any) => pt.id === id);
    const indicator = id ? {when: 'Update', while: 'Updating...'} : {when: 'Create', while: 'creating...'};
    
    const [ skillOptions, setSkillOptions ] = useState<Option[]>([]);
    const [ certificateOptions, setCertificateOptions ] = useState<Option[]>([]);

    const onSubmit = async (data: CertificateFormData) => {
        const resultAction = await dispatch(addEditCertificate(data));

        if (!addEditCertificate.rejected.match(resultAction)) {
            await dispatch(certificateListQuery());
            onClose?.();
        }
    };

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
    
    const resetItems = useMemo(
        () => mapCertificateToForm(certificateToHandle),
    [certificateToHandle]);

    useEffect(() => {
        const { lstSkills: lsfe } = certificateToHandle ?? {};
        const skillsFromEdit = lsfe ? optionsCreator({list: lsfe, iconKey: 'iconUrl'}) : [];
        const skillsStore = optionsCreator({list: lstSkills, iconKey: 'iconUrl'});
        setSkillOptions(mergeOptions(skillsFromEdit, skillsStore));

    }, [certificateToHandle, lstSkills]);

    useEffect(() => {
        const { certificate } = certificateToHandle ?? {};
        const certificateFromEdit = optionsCreator({list: certificate });
        const certificateFromStore = optionsCreator({list: lstCertificates});

        setCertificateOptions(mergeOptions(certificateFromEdit, certificateFromStore));
    }, [certificateToHandle, lstCertificates]);

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