import Image from 'next/image';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProfileForm from '@/app/[role]/[username]/forms/profileForm';
import { Copy, Home, Link, LogOut, Mail, MessageCircle, Phone, Settings } from 'lucide-react';
import { CheckPreferences, getClientLink } from '@/lib/utils/appFunctions';
import ContactMessageForm from '@/app/[role]/[username]/forms/contactMessageForm';
import { ContactMessagePage } from '@/app/[role]/[username]/dashboard/ContactMessagePage';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ProfileProps } from '@/components/ui/profile/types';
import { Button, cn, CUDModal, Paragraph, ResponsiveIcon } from '@/components';
import dayjs from 'dayjs';
import { widgetCard } from '@/styles';
import SettingsPage from '@/app/pages/profile/Settings'
import { PREFERENCES } from '@/lib/constants';

export const ProfileV2 = ({ 
    user,
    unreadContactMessageCount = 0,
    className
} : ProfileProps) => {

    const { role, username } = useParams<{role: 'owner' | 'client' | 'admin', username: string }>();
    const clientLink = getClientLink() as Record<string, string>;
    const profilePicture =
        user?.profilePicture ??
        (user?.gender === '0' ? '/Default-Female.svg' : '/Default-Male.svg');
    const coverPhoto = user?.coverPhoto ?? '/Default-CoverPhoto.svg';
    const router = useRouter();
    
    return (
        <section className={cn(widgetCard({ scroll: true , paddingY: 'none', paddingX: 'none'}), className)}>
            <div className='relative flex justify-center w-full'>
                <div className='absolute h-20 sm:h-40 w-full rounded-b-4xl overflow-hidden'>
                    <Image
                        src={coverPhoto}
                        alt="Cover photo"
                        fill
                        className="object-fill rounded-md"
                        priority
                    />
                </div>
                {/* Right side actions */}
                <div className='absolute right-7 sm:right-10 lg:right-15 bottom-[-1.5rem] sm:bottom-[-2rem] lg:bottom-[-3rem] flex gap-2.5 sm:gap-5 items-center'>
                    <ResponsiveIcon icon={Home} onClick={() => router.push('/')} className='cursor-pointer' />
                    <ThemeToggle />
                    {role === 'owner' && <ResponsiveIcon icon={LogOut} onClick={() => router.push(`/${role}/${username}/logout`)} className='cursor-pointer' />}
                </div>
                {/* Left side actions */}
                <div className='absolute left-7 sm:left-10 lg:left-15  bottom-[-1.5rem] sm:bottom-[-2rem] lg:bottom-[-3rem] flex gap-2.5 sm:gap-5 items-center'>
                    {role === 'owner' &&
                        <CUDModal subTitle='Settings' icon={Settings}>
                            <SettingsPage />
                        </CUDModal>
                    }
                    {role === 'owner' &&
                        <div className='relative'>
                            <CUDModal subTitle='Messages' icon={MessageCircle}>
                                <ContactMessagePage />
                            </CUDModal>
                            {
                                (unreadContactMessageCount && unreadContactMessageCount > 0)
                                    ?   <div className='absolute -top-1 -right-1 sm:-top-1.5 sm:-right-1.5 w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-success' />
                                    :   null
                            }
                        </div>
                    }
                </div>
                <div className='relative w-20 h-20 sm:w-30 sm:h-30 lg:w-40 lg:h-40 top-10 sm:top-20'>
                    <div className="w-20 h-20 sm:w-30 sm:h-30 lg:w-40 lg:h-40 rounded-full border-4 border-white bg-black/25 backdrop-blur-sm overflow-hidden">
                        <Image
                            src={profilePicture}
                            alt="Profile picture"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div className='absolute -right-1 -bottom-1'>
                        {role === 'owner'
                        ?   <CUDModal as='update' subTitle='Update profile' >
                                <ProfileForm />
                            </CUDModal>
                        :   role === 'client' &&
                            <CUDModal subTitle='Send Message' icon={MessageCircle} >
                                <ContactMessageForm />
                            </CUDModal>
                        }
                    </div>
                    <div className='absolute -bottom-1 -left-1'>
                        <CUDModal subTitle='Copy link' icon={Link}>
                            <Button rounded='full' onClick={() => navigator.clipboard.writeText(clientLink?.fullPath)}>
                                <Paragraph>
                                    <ResponsiveIcon icon={Copy} />
                                    {clientLink?.shortPath}
                                </Paragraph>
                            </Button>
                        </CUDModal>
                    </div>
                </div>
            </div>
            <div className='relative space-y-5 top-15 sm:top-25 px-5'>
                <div className='space-y-2'>
                    <Paragraph position='center' size='lg' className='font-bold'>
                        {user?.firstname} {user?.lastname}
                    </Paragraph>
                    <Paragraph position='center' className="italic">
                        {user?.title} 
                    </Paragraph>
                    {CheckPreferences(PREFERENCES.KEY.SHOW_GENDER) && user?.gender && 
                        <Paragraph position="center">
                            {user?.gender?.toString() === '1'
                                ? 'Male'
                                : user?.gender?.toString() === '0'
                                    ? 'Female'
                                    : ''
                            }
                        </Paragraph>
                    }
                    {CheckPreferences(PREFERENCES.KEY.SHOW_BIRTHDATE) && user?.birthDate &&
                        <Paragraph position="center">
                            {user?.birthDate ? ` (${ dayjs().diff(user.birthDate, 'year')} years old)` : ''}
                        </Paragraph>
                    }
                </div>
                <div className='flex justify-between py-4 gap-5'>
                    {CheckPreferences(PREFERENCES.KEY.SHOW_EMAIL_ADDRESS) &&
                        <Paragraph>
                            <ResponsiveIcon icon={Mail} />
                            {user?.email}
                            <ResponsiveIcon icon={Copy} onClick={() => navigator.clipboard.writeText(user.email as string)} className='cursor-pointer' />
                        </Paragraph>
                    }
                    {CheckPreferences(PREFERENCES.KEY.SHOW_PHONE_NUMBER) && user?.phone &&
                        <Paragraph>
                            <ResponsiveIcon icon={Phone} />
                            {user.phone}
                            <ResponsiveIcon icon={Copy} onClick={() => navigator.clipboard.writeText(user?.phone as string)} className='cursor-pointer' />
                        </Paragraph>
                    }
                </div>
                {user?.bio &&
                    <div>
                        <Paragraph text='justify' className='pb-5'>
                            {user.bio} 
                        </Paragraph>
                    </div>
                }
            </div>
        </section>
    );
};