'use client';

import { useAppSelector } from "@/lib/store/hooks";
import { ControlledForm, ImageUploader } from '@/features/dashboard/forms';
import { FormItem } from '@/features/dashboard/forms/types.forms';
import { useMemo } from "react";
import { profileSchema } from "../schema";
import { useHandleSubmit } from "../hooks";

const genderOptions = [
    { label: 'Female', value: '0' },
    { label: 'Male', value: '1' },
];

export const ProfileForm = ({ onClose } : { onClose?: () => void }) => {

    const { loading, error, user } = useAppSelector((state) => state.profile);
    const onSubmit = useHandleSubmit({ onClose });

    const items = useMemo<FormItem<typeof profileSchema>[]>(() => [
        {as: 'Input', name: 'firstname', label: 'First name', placeholder: 'John'},
        {as: 'Input', name: 'lastname', label: 'Last name', placeholder: 'Doe'},
        {as: 'Input', name: 'title', label: 'Title', placeholder: 'Sr. Next.js Developer'},
        {as: 'Input', name: 'bio', label: 'Bio', placeholder: 'Describe yourself', type: 'Textarea'},
        {as: 'Input', name: 'phone', label: 'Phone', placeholder: '+0 123456789'},
        {
            as: 'Modal',
            name: 'profilePicture',
            modal: {
                as: 'update',
                children: <ImageUploader preset="Profile_Picture"/>,
                title:'Update profile picture',
                subTitle: 'Choose a new profile picture'
            }
        },
        {
            as: 'Modal',
            name: 'coverPhoto',
            modal: {
                as: 'update',
                children: <ImageUploader preset="Cover_Photo" />,
                title:'Update cover photo',
                subTitle: 'Choose a new cover photo'
            }
        },
        {as: 'Dropdown', name: 'gender', label: 'Gender', options: genderOptions},
        {as: 'Input', name: 'birthDate', label: 'Birth date', type: 'Date'}
    ], []);

    return (
        <ControlledForm
            schema={profileSchema}
            onSubmit={onSubmit}
            items={items}
            error={error}
            loading={loading}
            resetItems={user ? {
                ...user,
                gender: user?.gender?.toString()
            } : undefined}
            indicator={{when: 'Update', while: 'Updating...'}}
        />
    );
}
