import { Header } from '@/components/shared/Header';
import Image from 'next/image';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import ProfileForm from '@/app/[role]/[username]/forms/profileForm';
import { Bell, Briefcase, Copy, Folder, GraduationCap, Home, Languages, Link, LogOut, Mail, MessageCircle, MessageSquare, Phone, Settings } from 'lucide-react';
import { getClientLink } from '@/lib/utils/appFunctions';
import ContactMessageForm from '@/app/[role]/[username]/forms/contactMessageForm';
import { ContactMessagePage } from '@/app/[role]/[username]/dashboard/ContactMessagePage';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ProfileProps } from '@/components/ui/profile/types';
import { Button, cn, CUDModal, Paragraph, ResponsiveIcon } from '@/components';
import dayjs from 'dayjs';
import { useAppSelector } from '@/lib/store/hooks';
import { widgetCard } from '@/styles';

export const TestProfile = ({ 
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

    const { lstEducations} = useAppSelector(state => state.education);
    const { lstProjectTechnologies} = useAppSelector(state => state.projectTechnology);
    const { lstUserLanguages} = useAppSelector(state => state.userLanguage);
    const { lstExperiences} = useAppSelector(state => state.experience);
    
    return (
    <>
        <section className={cn(widgetCard({ scroll: true , paddingY: 'none', paddingX: 'none'}))}>
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
                    {(user?.gender === '0' || user?.gender === '1' || user?.birthDate) && (
                        <Paragraph position="center">
                            {user?.gender?.toString() === '1'
                            ? 'Male'
                            : user?.gender?.toString() === '0'
                            ? 'Female'
                            : ''}
                            {user?.birthDate ? ` (${ dayjs().diff(user.birthDate, 'year')} years old)` : ''}
                        </Paragraph>
                    )}
                </div>
                <div className='flex justify-between py-4 gap-5'>
                    <Paragraph>
                        <ResponsiveIcon icon={Mail} />
                        {user?.email}
                        <ResponsiveIcon icon={Copy} onClick={() => navigator.clipboard.writeText(user.email as string)} className='cursor-pointer' />
                    </Paragraph>
                    {user?.phone &&
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
        {/* <div className='flex-col space-y-5 w-full col-span-2'>
            {user?.bio &&
                <div className={cn(widgetCard())}>
                    <Paragraph size="lg">
                        Bio
                    </Paragraph>
                    <Paragraph text='justify'>
                        {user.bio} 
                    </Paragraph>
                </div>
            }
            <div className='flex h-20 gap-5'>
                <div className={cn(widgetCard(), 'w-full')}>
                    <Paragraph size="lg" space="xs">
                        <ResponsiveIcon icon={GraduationCap} />
                        Education
                    </Paragraph>
                    <Paragraph>
                        {`Total count:  ${lstEducations.length}`}
                    </Paragraph>
                </div>
                <div className={cn(widgetCard(), 'w-full')}>
                    <Paragraph size="lg" space="xs">
                        <ResponsiveIcon icon={Briefcase} />
                        Experience
                    </Paragraph>
                    <Paragraph>
                        {`Total count:  ${lstExperiences.length}`}
                    </Paragraph>
                </div>
            </div>
            <div className='flex h-20 gap-5'>
                <div className={cn(widgetCard(), 'w-full')}>
                    <Paragraph size="lg" space="xs">
                        <ResponsiveIcon icon={Languages} />
                        Language
                    </Paragraph>
                    <Paragraph>
                        {`Total count: ${lstUserLanguages.length}`}
                    </Paragraph>
                </div>
                <div className={cn(widgetCard(), 'w-full')}>
                    <Paragraph size="lg" space="xs">
                        <ResponsiveIcon icon={Folder} />
                        Project
                    </Paragraph>
                    <Paragraph>
                        {`Total count:  ${lstProjectTechnologies.length}`}
                    </Paragraph>
                </div>
            </div>
        </div> */}
    </>
  );
};