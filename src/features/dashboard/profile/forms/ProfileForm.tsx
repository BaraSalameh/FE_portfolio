'use client';

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { ControlledForm, ImageUploader } from "@/components/ui/form";
import { useMemo } from "react";
import { ProfileFormData, profileSchema } from "../schema";
import { editProfile, userInfoQuery } from "@/features";

export const ProfileForm = ({ onClose } : { onClose?: () => void }) => {

    const dispatch = useAppDispatch();
    const { loading, error, user } = useAppSelector((state) => state.profile);
    const genderOptions = [
        { label: 'Female', value: '0' },
        { label: 'Male', value: '1' }
    ];

    const onSubmit = async (data: ProfileFormData) => {
        const resultAction = await dispatch(editProfile(data));

        if (!editProfile.rejected.match(resultAction)) {
            await dispatch(userInfoQuery());
            onClose?.();
        }
    };

    const items = useMemo(() => [
        {as: 'Input', name: 'firstname', label: 'Firstname', placeholder: 'John'},
        {as: 'Input', name: 'lastname', label: 'Lastname', placeholder: 'Doe'},
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
    ], [genderOptions]);

    return (
        <ControlledForm
            schema={profileSchema}
            onSubmit={onSubmit}
            items={items as any}
            error={error}
            loading={loading}
            resetItems={{
                ...user as any,
                gender: user?.gender?.toString()
            }}
            indicator={{when: 'Update', while: 'Updating...'}}
        />
    );
}