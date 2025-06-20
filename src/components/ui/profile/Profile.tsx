import { Header } from '@/components/shared/Header';
import Image from 'next/image';
import React from 'react';
import { Paragraph, CUDModal, ResponsiveIcon } from '..';
import { useParams, useRouter } from 'next/navigation';
import ProfileForm from '@/app/[role]/[username]/forms/profileForm';
import { Button } from '../form/Button';
import { Copy, Home, Link, LogOut, MessageCircle, MessageSquare, Settings } from 'lucide-react';
import { getClientLink } from '@/lib/utils/appFunctions';
import { ProfileProps } from './types';
import ContactMessageForm from '@/app/[role]/[username]/forms/contactMessageForm';
import { ContactMessagePage } from '@/app/[role]/[username]/dashboard/ContactMessagePage';
import { ThemeToggle } from '../ThemeToggle';

export const Profile = ({ 
    user,
    unreadContactMessageCount = 0,
    className
} : ProfileProps) => {

    const { role, username } = useParams<{role: 'owner' | 'client' | 'admin', username: string }>();
    const clientLink = getClientLink() as string;
    const profilePicture =
        user?.profilePicture ??
        (user?.gender === '0' ? '/Default-Female.svg' : '/Default-Male.svg');
    const coverPhoto = user?.coverPhoto ?? '/Default-CoverPhoto.svg';
    const router = useRouter();
    
  return (
    <Header space='lg' paddingY='sm' itemsY='start' className={`grid grid-cols-1 ${className}`}>
        <div className="relative h-35 sm:h-50 lg:h-60">
            {/* Cover Photo */}
            <Image
                src={coverPhoto}
                alt="Cover photo"
                fill
                className="object-fill rounded-3xl "
                priority
            />
            {/* Right side actions */}
            <div className="absolute right-7 sm:right-10 lg:right-15 bottom-[-2rem] sm:bottom-[-2.5rem] lg:bottom-[-3.5rem] flex gap-5 items-center">
                <ResponsiveIcon icon={Home} onClick={() => router.push('/')} className='cursor-pointer' />
                <ResponsiveIcon icon={Settings} className='cursor-pointer' />
                <ThemeToggle />
                {role === 'owner' &&
                    <div className='relative'>
                        <CUDModal subTitle='Messages' icon={MessageSquare}>
                            <ContactMessagePage />
                        </CUDModal>
                        {
                            (unreadContactMessageCount && unreadContactMessageCount > 0)
                                ?    <div className='absolute -bottom-3 -right-3 w-5 h-5 rounded-full bg-green-300 flex justify-center items-center'>
                                        <Paragraph>
                                            {unreadContactMessageCount < 100
                                                ? unreadContactMessageCount
                                                : '99+'
                                            }
                                        </Paragraph>
                                    </div>
                                : null
                        }
                    </div>
                }
                <ResponsiveIcon icon={LogOut} onClick={() => router.push(`/${role}/${username}/logout`)} className='cursor-pointer' />
            </div>
            {/* Profile and Info */}
            <div className="absolute left-7 sm:left-10 lg:left-15 bottom-[-2rem] sm:bottom-[-2.5rem] lg:bottom-[-3.5rem] flex flex-col items-center">
                <div className="relative w-20 h-20 sm:w-30 sm:h-30 lg:w-40 lg:h-40 rounded-full border-4 border-white bg-black/25 backdrop-blur-sm overflow-hidden">
                    <Image
                        src={profilePicture}
                        alt="Profile picture"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
                {/* Left side actions */}
                <div className='absolute right-0 bottom-0'>
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
                <div className='absolute bottom-0 left-0'>
                    <CUDModal subTitle='Copy link' icon={Link}>
                        <Button rounded='full' onClick={() => navigator.clipboard.writeText(clientLink)}>
                            <Paragraph>
                                <ResponsiveIcon icon={Copy} />
                                {clientLink}
                            </Paragraph>
                        </Button>
                    </CUDModal>
                </div>
            
            </div>
        </div>
        
        <div className='px-7 sm:px-10 lg:px-15 pt-3 space-y-1'>
            <Paragraph position='start' size='lg'>
                {user?.firstname} {user?.lastname}
            </Paragraph>
            <Paragraph position='start' className="italic">
                {user?.title}
            </Paragraph>
            {(user?.gender === '0' || user?.gender === '1' || user?.birthDate) && (
                <Paragraph position="start">
                    {user?.gender?.toString() === '1'
                    ? 'Male'
                    : user?.gender?.toString() === '0'
                    ? 'Female'
                    : ''}
                    {user?.birthDate ? ` (${user.birthDate})` : ''}
                </Paragraph>
            )}
            {(user?.bio) && 
                <hr className='pb-3' />
            }
            {
                <Paragraph>
                    {user?.bio}
                </Paragraph>
            }
        </div>
    </Header>
  );
};