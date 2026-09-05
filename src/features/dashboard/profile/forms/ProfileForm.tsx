'use client';

import { ActionDialog } from '@/design-system';
import { ControlledForm, ImageUploader } from '@/features/dashboard/forms';
import type { FormItem } from '@/features/dashboard/forms/types.forms';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { Camera, ImagePlus } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useHandleSubmit } from '../hooks';
import { removeProfileImage, uploadProfileImage } from '../api';
import { profileSchema, type ProfileFormData } from '../schema';
import { profileImageUpdated } from '../slice';
import { profileImageKindByField, type ProfileImageField } from '../types.profile';

const genderOptions = [
    { label: 'Female', value: '0' },
    { label: 'Male', value: '1' },
];

function ProfileImageFields() {
    const { control, setValue } = useFormContext<ProfileFormData>();
    const dispatch = useAppDispatch();
    const [savedMessage, setSavedMessage] = useState<string | null>(null);
    const [profilePictureValue, coverPhotoValue, gender] = useWatch({ control, name: ['profilePicture', 'coverPhoto', 'gender'] });
    const profilePicture = profilePictureValue ?? (gender === '0' ? '/Default-Female.svg' : '/Default-Male.svg');
    const coverPhoto = coverPhotoValue ?? '/Default-CoverPhoto.svg';

    const handleImageSaved = (field: ProfileImageField, value: string) => {
        setValue(field, value, { shouldDirty: false });
        dispatch(profileImageUpdated({ field, url: value }));
        setSavedMessage(field === 'profilePicture' ? 'Profile photo saved.' : 'Cover photo saved.');
    };

    const handleImageRemoved = async (field: ProfileImageField) => {
        await removeProfileImage(profileImageKindByField[field]);
        setValue(field, null, { shouldDirty: false });
        dispatch(profileImageUpdated({ field, url: null }));
        setSavedMessage(field === 'profilePicture' ? 'Profile photo removed.' : 'Cover photo removed.');
    };

    return <section className="mb-7 overflow-hidden rounded-2xl border border-line bg-surface shadow-sm">
        <div className="relative h-44 sm:h-56">
            <Image src={coverPhoto} alt="Current cover preview" fill className="object-cover" sizes="(max-width: 1152px) 100vw, 72rem" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" aria-hidden="true" />
            <ActionDialog as="update" title="Change cover" subTitle="Choose a new cover photo" icon={ImagePlus} triggerClassName="absolute right-4 top-4 border border-white/20 bg-black/35 px-3 text-white shadow-lg backdrop-blur-md hover:bg-black/50 hover:text-white">
                <ImageUploader preset="Cover_Photo" uploadImage={(file) => uploadProfileImage(file, profileImageKindByField.coverPhoto)} onAction={(value) => handleImageSaved('coverPhoto', value)} onRemove={coverPhotoValue ? () => handleImageRemoved('coverPhoto') : undefined} />
            </ActionDialog>
        </div>
        <div className="relative flex flex-col gap-4 px-5 pb-6 sm:flex-row sm:items-end sm:px-7">
            <div className="relative -mt-12 size-28 shrink-0 rounded-[1.5rem] border-4 border-surface bg-canvas-subtle shadow-xl">
                <span className="absolute inset-0 overflow-hidden rounded-[1.15rem]"><Image src={profilePicture} alt="Current profile preview" fill className="object-cover" sizes="112px" /></span>
                <ActionDialog as="update" subTitle="Choose a new profile picture" icon={Camera} triggerClassName="absolute -bottom-2 -right-2 z-10 grid size-10 min-h-0 place-items-center rounded-xl border border-line bg-surface-raised p-0 text-ink-muted shadow-md hover:bg-canvas-subtle hover:text-ink">
                    <ImageUploader preset="Profile_Picture" uploadImage={(file) => uploadProfileImage(file, profileImageKindByField.profilePicture)} onAction={(value) => handleImageSaved('profilePicture', value)} onRemove={profilePictureValue ? () => handleImageRemoved('profilePicture') : undefined} />
                </ActionDialog>
            </div>
            <div className="sm:pb-1"><h2 className="text-xl font-bold tracking-[-0.035em]">Profile photos</h2><p className="mt-1 text-sm text-ink-muted">Photos are saved as soon as you apply them.</p>{savedMessage ? <p role="status" className="mt-1 text-sm font-semibold text-success">{savedMessage}</p> : null}</div>
        </div>
    </section>;
}

export const ProfileForm = ({ onClose }: { onClose?: () => void }) => {
    const { loading, error, user } = useAppSelector((state) => state.profile);
    const onSubmit = useHandleSubmit({ onClose });
    const items = useMemo<FormItem<typeof profileSchema>[]>(() => [
        { as: 'Input', name: 'firstname', label: 'First name', placeholder: 'John' },
        { as: 'Input', name: 'lastname', label: 'Last name', placeholder: 'Doe' },
        { as: 'Input', name: 'title', label: 'Title', placeholder: 'Sr. Next.js Developer' },
        { as: 'Input', name: 'bio', label: 'Bio', placeholder: 'Describe yourself', type: 'Textarea' },
        { as: 'Input', name: 'phone', label: 'Phone', placeholder: '+0 123456789' },
        { as: 'Dropdown', name: 'gender', label: 'Gender', options: genderOptions },
        { as: 'Input', name: 'birthDate', label: 'Birth date', type: 'Date' },
    ], []);

    return <ControlledForm schema={profileSchema} onSubmit={onSubmit} items={items} error={error} loading={loading} resetItems={user ? { ...user, gender: user.gender?.toString() } : undefined} indicator={{ when: 'Update', while: 'Updating...' }}>
        <ProfileImageFields />
    </ControlledForm>;
};
