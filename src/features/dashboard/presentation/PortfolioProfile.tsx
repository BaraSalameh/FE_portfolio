'use client';

import { ActionDialog, ThemeSwitch } from '@/design-system';
import { OwnerHeaderActions } from '@/features/dashboard/profile/account';
import type { ProfileProps } from '@/features/dashboard/profile/types.profile';
import { useAppSelector } from '@/lib/store/hooks';
import { checkWidgetPreferences, useUrlParams, widget_preferences } from '@/lib/utils';
import dayjs from 'dayjs';
import { Home, MapPin, MessageCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { ContactLinksSection } from './ContactLinksSection';

const ContactMessageForm = dynamic(() => import('../profile/contact-message/forms/ContactMessageForm').then((module) => module.ContactMessageForm));

const iconButton = 'grid size-10 place-items-center rounded-xl border border-line bg-surface-raised text-ink-muted shadow-sm transition hover:-translate-y-0.5 hover:border-accent/30 hover:text-ink';
export function PortfolioProfile({ user, unreadContactMessageCount = 0, socialLinks = [] }: ProfileProps) {
    const { role, username } = useUrlParams();
    const preferences = useAppSelector((state) => state.userWidgetPreference.lstUserPreferences);
    const profilePicture = user.profilePicture ?? (user.gender === '0' ? '/Default-Female.svg' : '/Default-Male.svg');
    const coverPhoto = user.coverPhoto ?? '/Default-CoverPhoto.svg';
    const showWhatsApp = Boolean(checkWidgetPreferences(preferences, widget_preferences.key.show_whatsapp, 'show', false));
    const showSiteLinks = Boolean(checkWidgetPreferences(preferences, widget_preferences.key.show_site_links, 'show', false));
    const showCv = Boolean(checkWidgetPreferences(preferences, widget_preferences.key.show_cv, 'show', false));

    return (
        <section className="rounded-[1.75rem] border border-line bg-surface shadow-lg shadow-black/5">
            <div className="relative h-40 overflow-hidden rounded-t-[1.7rem] sm:h-52">
                <Image src={coverPhoto} alt="Portfolio cover" fill className="object-cover" priority sizes="(max-width: 1440px) 100vw, 88rem" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" aria-hidden="true" />
                <div className="absolute left-4 top-4 flex gap-2 sm:left-6 sm:top-6">
                    <Link href="/" className={iconButton} aria-label="Go to home page"><Home className="size-4" aria-hidden="true" /></Link>
                    {role === 'client' && <ThemeSwitch className="rounded-xl" />}
                </div>
                {role === 'owner' && (
                    <OwnerHeaderActions user={user} unreadMessageCount={unreadContactMessageCount} inverted className="absolute right-4 top-4 sm:right-6 sm:top-6" />
                )}
            </div>

            <div className="relative px-5 pb-7 sm:px-8 sm:pb-8">
                <div className="-mt-12 flex flex-col gap-6 sm:-mt-14 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-5">
                        <div className="relative">
                            <div className="relative size-28 overflow-hidden rounded-[1.6rem] border-4 border-surface bg-canvas-subtle shadow-xl sm:size-32">
                                <Image src={profilePicture} alt={`${user.firstname} ${user.lastname}'s profile picture`} fill className="object-cover" priority sizes="128px" />
                            </div>
                            {role !== 'owner' ? <div className="absolute -bottom-2 -right-2 rounded-xl border border-line bg-surface-raised shadow-md"><ActionDialog subTitle="Send Message" icon={MessageCircle}><ContactMessageForm /></ActionDialog></div> : null}
                        </div>
                        <div className="text-center sm:mt-16 sm:pt-1 sm:text-left">
                            <h1 className="text-2xl font-bold tracking-[-0.045em] sm:text-3xl">{user.firstname} {user.lastname}</h1>
                            <p className="mt-1 text-sm font-medium text-ink-muted sm:text-base">{user.title || 'Portfolio professional'}</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-ink-muted sm:mt-16 sm:max-w-[45%] sm:justify-end sm:pt-2 sm:text-right">
                        {user.address && <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5 text-accent" aria-hidden="true" />{user.address}</span>}
                        {checkWidgetPreferences(preferences, widget_preferences.key.show_gender) && user.gender && <span>{user.gender.toString() === '1' ? 'Male' : 'Female'}</span>}
                        {checkWidgetPreferences(preferences, widget_preferences.key.show_birthdate) && user.birthDate && <span>{dayjs().diff(user.birthDate, 'year')} years old</span>}
                    </div>
                </div>

                <div className="mt-7 border-t border-line pt-6">
                    <div>
                        {user.bio && <p className="w-full whitespace-pre-wrap text-justify text-sm leading-7 text-ink-muted sm:text-[0.95rem]">{user.bio}</p>}
                    </div>
                </div>
                <ContactLinksSection
                    user={user}
                    socialLinks={socialLinks}
                    showEmail={Boolean(checkWidgetPreferences(preferences, widget_preferences.key.show_email_address))}
                    showPhone={Boolean(checkWidgetPreferences(preferences, widget_preferences.key.show_phone_number))}
                    showWhatsApp={showWhatsApp}
                    showCv={showCv}
                    showSiteLinks={showSiteLinks}
                    sharePath={username ? `/client/${encodeURIComponent(username)}/dashboard` : ''}
                />
            </div>
        </section>
    );
}
