'use client';

import { ActionDialog, ThemeSwitch } from '@/design-system';
import type { ProfileProps } from '@/features/dashboard/profile/types.profile';
import { useAppSelector } from '@/lib/store/hooks';
import { checkWidgetPreferences, getClientLink, useUrlParams, widget_preferences } from '@/lib/utils';
import { paths } from '@/lib/pathHelper';
import dayjs from 'dayjs';
import { Copy, Home, Link as LinkIcon, Mail, MessageCircle, Phone, Settings } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const ContactMessagePage = dynamic(() => import('../profile/contact-message/components/ContactMessagePage').then((module) => module.ContactMessagePage));
const ProfileForm = dynamic(() => import('../profile/forms/ProfileForm').then((module) => module.ProfileForm));
const ContactMessageForm = dynamic(() => import('../profile/contact-message/forms/ContactMessageForm').then((module) => module.ContactMessageForm));

const iconButton = 'grid size-10 place-items-center rounded-xl border border-line bg-surface-raised text-ink-muted shadow-sm transition hover:-translate-y-0.5 hover:border-accent/30 hover:text-ink';

export function PortfolioProfile({ user, unreadContactMessageCount = 0 }: ProfileProps) {
    const { role, username } = useUrlParams();
    const clientLink = getClientLink() as Record<string, string>;
    const preferences = useAppSelector((state) => state.userWidgetPreference.lstUserPreferences);
    const [copyMessage, setCopyMessage] = useState('');
    const profilePicture = user.profilePicture ?? (user.gender === '0' ? '/Default-Female.svg' : '/Default-Male.svg');
    const coverPhoto = user.coverPhoto ?? '/Default-CoverPhoto.svg';
    const copy = async (value: string | null | undefined, message: string) => {
        if (!value) return;
        await navigator.clipboard.writeText(value);
        setCopyMessage(message);
    };

    return (
        <section className="overflow-hidden rounded-[1.75rem] border border-line bg-surface shadow-lg shadow-black/5">
            <div className="relative h-40 sm:h-52">
                <Image src={coverPhoto} alt="Portfolio cover" fill className="object-cover" priority sizes="(max-width: 1440px) 100vw, 88rem" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" aria-hidden="true" />
                <div className="absolute left-4 top-4 flex gap-2 sm:left-6 sm:top-6">
                    <Link href="/" className={iconButton} aria-label="Go to home page"><Home className="size-4" aria-hidden="true" /></Link>
                    {role === 'client' && <ThemeSwitch className="rounded-xl" />}
                </div>
                {role === 'owner' && (
                    <div className="absolute right-4 top-4 flex items-center gap-1 rounded-2xl border border-white/20 bg-black/25 p-1 text-white shadow-lg backdrop-blur-md sm:right-6 sm:top-6">
                        {username && (
                            <Link
                                href={paths.root.settings('owner', username).path()}
                                className="grid size-10 place-items-center rounded-xl text-white transition hover:bg-white/10"
                                aria-label="Settings"
                            >
                                <Settings className="size-4" aria-hidden="true" />
                            </Link>
                        )}
                        <div className="relative">
                            <ActionDialog subTitle="Messages" icon={MessageCircle}><ContactMessagePage /></ActionDialog>
                            {unreadContactMessageCount > 0 && <span className="absolute right-1 top-1 size-2 rounded-full bg-highlight ring-2 ring-black/30" aria-label={`${unreadContactMessageCount} unread messages`} />}
                        </div>
                    </div>
                )}
            </div>

            <div className="relative px-5 pb-7 sm:px-8 sm:pb-8">
                <div className="-mt-14 flex flex-col gap-5 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-end">
                        <div className="relative">
                            <div className="relative size-28 overflow-hidden rounded-[1.6rem] border-4 border-surface bg-canvas-subtle shadow-xl sm:size-32">
                                <Image src={profilePicture} alt={`${user.firstname} ${user.lastname}'s profile picture`} fill className="object-cover" priority sizes="128px" />
                            </div>
                            <div className="absolute -bottom-2 -right-2 rounded-xl border border-line bg-surface-raised shadow-md">
                                {role === 'owner' ? (
                                    <ActionDialog as="update" subTitle="Update profile"><ProfileForm /></ActionDialog>
                                ) : (
                                    <ActionDialog subTitle="Send Message" icon={MessageCircle}><ContactMessageForm /></ActionDialog>
                                )}
                            </div>
                        </div>
                        <div className="text-center sm:pb-1 sm:text-left">
                            <h1 className="text-2xl font-bold tracking-[-0.045em] sm:text-3xl">{user.firstname} {user.lastname}</h1>
                            <p className="mt-1 text-sm font-medium text-ink-muted sm:text-base">{user.title || 'Portfolio professional'}</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => void copy(clientLink.fullPath, 'Portfolio link copied')}
                        className="inline-flex min-h-10 items-center justify-center gap-2 self-center rounded-full border border-line bg-surface-raised px-4 text-sm font-semibold text-ink-muted shadow-sm transition hover:border-accent/30 hover:text-ink sm:mb-1 sm:self-auto"
                    >
                        <LinkIcon className="size-4" aria-hidden="true" /> Share portfolio
                    </button>
                </div>

                <div className="mt-7 grid gap-6 border-t border-line pt-6 lg:grid-cols-[minmax(0,1fr)_auto]">
                    <div>
                        {user.bio && <p className="max-w-3xl text-sm leading-7 text-ink-muted sm:text-[0.95rem]">{user.bio}</p>}
                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-ink-muted">
                            {checkWidgetPreferences(preferences, widget_preferences.key.show_gender) && user.gender && <span>{user.gender.toString() === '1' ? 'Male' : 'Female'}</span>}
                            {checkWidgetPreferences(preferences, widget_preferences.key.show_birthdate) && user.birthDate && <span>{dayjs().diff(user.birthDate, 'year')} years old</span>}
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 text-sm">
                        {checkWidgetPreferences(preferences, widget_preferences.key.show_email_address) && user.email && (
                            <button type="button" onClick={() => void copy(user.email, 'Email address copied')} className="flex items-center gap-2 rounded-xl px-3 py-2 text-left text-ink-muted transition hover:bg-canvas-subtle hover:text-ink">
                                <Mail className="size-4 text-accent" aria-hidden="true" /><span className="max-w-64 truncate">{user.email}</span><Copy className="size-3.5" aria-hidden="true" />
                            </button>
                        )}
                        {checkWidgetPreferences(preferences, widget_preferences.key.show_phone_number) && user.phone && (
                            <button type="button" onClick={() => void copy(user.phone, 'Phone number copied')} className="flex items-center gap-2 rounded-xl px-3 py-2 text-left text-ink-muted transition hover:bg-canvas-subtle hover:text-ink">
                                <Phone className="size-4 text-accent" aria-hidden="true" />{user.phone}<Copy className="size-3.5" aria-hidden="true" />
                            </button>
                        )}
                    </div>
                </div>
                <p className="sr-only" aria-live="polite">{copyMessage}</p>
            </div>
        </section>
    );
}
