'use client';

import type { ProfileFormData } from '@/features/dashboard/profile/schema';
import type { SocialLinkResponse } from '@/features/dashboard/types.dashboard';
import { AtSign, ContactRound, Copy, Download, Github, Globe2, Link as LinkIcon, Linkedin, Mail, MessageCircle, MoreHorizontal, Phone, PhoneCall, Share2 } from 'lucide-react';
import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';

type ContactLinksSectionProps = {
    user: ProfileFormData;
    socialLinks: SocialLinkResponse[];
    showEmail: boolean;
    showPhone: boolean;
    showWhatsApp: boolean;
    showCv: boolean;
    showSiteLinks: boolean;
    sharePath: string;
};

type OpenMenu = 'email' | 'phone' | null;

const cardClass = 'relative flex min-h-14 min-w-0 items-center gap-3 rounded-2xl border border-line bg-surface-raised px-4 text-left text-sm font-semibold text-ink shadow-sm transition hover:border-accent/35 hover:bg-canvas-subtle';
const menuItemClass = 'flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-ink-muted transition hover:bg-canvas-subtle hover:text-ink focus-visible:bg-canvas-subtle focus-visible:text-ink focus-visible:outline-none';
const quickLinkClass = 'grid size-11 place-items-center rounded-full border border-line bg-surface-raised text-ink-muted shadow-sm transition hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40';

function escapeVcard(value: string) {
    return value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
}

function socialIcon(platform: string) {
    if (platform === 'LinkedIn') return Linkedin;
    if (platform === 'GitHub') return Github;
    if (platform === 'Personal website') return Globe2;
    return LinkIcon;
}

export function ContactLinksSection({ user, socialLinks, showEmail, showPhone, showWhatsApp, showCv, showSiteLinks, sharePath }: ContactLinksSectionProps) {
    const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
    const [status, setStatus] = useState('');
    const sectionRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const menuBaseId = useId();

    const hasEmail = showEmail && Boolean(user.email);
    const hasPhone = showPhone && Boolean(user.phone);
    const hasWhatsApp = showWhatsApp && Boolean(user.whatsAppNumber);
    const hasCv = showCv && Boolean(user.cvUrl);
    const visibleSites = showSiteLinks ? socialLinks : [];
    const hasItems = hasEmail || hasPhone || hasCv || visibleSites.length > 0 || Boolean(sharePath);
    const hasQuickActions = hasCv || visibleSites.length > 0 || Boolean(sharePath);

    useEffect(() => {
        if (!openMenu) return;

        const closeOnPointerDown = (event: PointerEvent) => {
            if (!sectionRef.current?.contains(event.target as Node)) setOpenMenu(null);
        };
        const closeOnEscape = (event: globalThis.KeyboardEvent) => {
            if (event.key !== 'Escape') return;
            setOpenMenu(null);
            triggerRef.current?.focus();
        };
        document.addEventListener('pointerdown', closeOnPointerDown);
        document.addEventListener('keydown', closeOnEscape);
        return () => {
            document.removeEventListener('pointerdown', closeOnPointerDown);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [openMenu]);

    useEffect(() => {
        if (!openMenu) return;
        const frame = requestAnimationFrame(() => sectionRef.current?.querySelector<HTMLElement>(`#${CSS.escape(`${menuBaseId}-${openMenu}`)} [role="menuitem"]`)?.focus());
        return () => cancelAnimationFrame(frame);
    }, [menuBaseId, openMenu]);

    if (!hasItems) return null;

    const copy = async (value: string, message: string) => {
        try {
            await navigator.clipboard.writeText(value);
            setStatus(message);
            setOpenMenu(null);
        } catch {
            setStatus('Unable to copy. Please copy the value manually.');
        }
    };

    const toggleMenu = (menu: Exclude<OpenMenu, null>, event: MouseEvent<HTMLButtonElement>) => {
        triggerRef.current = event.currentTarget;
        setOpenMenu((current) => current === menu ? null : menu);
    };

    const handleMenuKeys = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
        event.preventDefault();
        const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]'));
        const currentIndex = items.indexOf(document.activeElement as HTMLElement);
        const delta = event.key === 'ArrowDown' ? 1 : -1;
        items[(currentIndex + delta + items.length) % items.length]?.focus();
    };

    const downloadContact = () => {
        const fullName = `${user.firstname} ${user.lastname}`.trim();
        const lines = ['BEGIN:VCARD', 'VERSION:3.0', `FN:${escapeVcard(fullName || 'Portfolio contact')}`];
        if (user.phone) lines.push(`TEL;TYPE=CELL:${escapeVcard(user.phone)}`);
        if (hasEmail && user.email) lines.push(`EMAIL;TYPE=INTERNET:${escapeVcard(user.email)}`);
        lines.push('END:VCARD');
        const url = URL.createObjectURL(new Blob([`${lines.join('\r\n')}\r\n`], { type: 'text/vcard;charset=utf-8' }));
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `${fullName.replace(/[^A-Za-z0-9_-]+/g, '-') || 'portfolio-contact'}.vcf`;
        anchor.click();
        setTimeout(() => URL.revokeObjectURL(url), 0);
        setStatus('Contact file downloaded');
        setOpenMenu(null);
    };

    return <section ref={sectionRef} className="mx-auto mt-6 max-w-5xl rounded-[1.75rem] border border-line bg-canvas-subtle/70 p-5 shadow-inner shadow-black/5 sm:p-6" aria-labelledby="sites-contact-heading">
        <h2 id="sites-contact-heading" className="sr-only">Sites &amp; contact</h2>

        {hasQuickActions ? <div className="flex flex-wrap items-center justify-center gap-2.5">
            {visibleSites.map((link, index) => { const SocialIcon = socialIcon(link.platform); return <a key={link.id ?? `${link.url}-${index}`} href={link.url} target="_blank" rel="noopener noreferrer" className={quickLinkClass} aria-label={link.platform} title={link.platform}><SocialIcon className="size-4" aria-hidden="true" /></a>; })}
            {hasCv && user.cvUrl ? <a href={user.cvUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface-raised px-4 text-sm font-bold text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"><Download className="size-4 text-accent" aria-hidden="true" />Download CV</a> : null}
            {sharePath ? <button type="button" onClick={() => void copy(new URL(sharePath, window.location.origin).href, 'Portfolio link copied')} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-surface-raised px-4 text-sm font-bold text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"><Share2 className="size-4 text-accent" aria-hidden="true" />Share portfolio</button> : null}
        </div> : null}

        <div className={`mx-auto grid max-w-2xl gap-2.5 sm:grid-cols-2 ${hasQuickActions ? 'mt-5' : ''}`}>
            {hasEmail && user.email ? <div className="relative min-w-0">
                <button type="button" onClick={(event) => toggleMenu('email', event)} className={`${cardClass} w-full`} aria-haspopup="menu" aria-expanded={openMenu === 'email'} aria-controls={`${menuBaseId}-email`}>
                    <Mail className="size-4 shrink-0 text-accent" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate">{user.email}</span>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line" aria-hidden="true"><MoreHorizontal className="size-4" /></span>
                    <span className="sr-only">Open email actions</span>
                </button>
                {openMenu === 'email' ? <div id={`${menuBaseId}-email`} role="menu" aria-label="Email actions" onKeyDown={handleMenuKeys} className="absolute right-0 z-50 mt-2 w-44 rounded-2xl border border-line bg-surface p-2 shadow-2xl shadow-black/15">
                    <a role="menuitem" href={`mailto:${user.email}`} onClick={() => setOpenMenu(null)} className={menuItemClass}><AtSign className="size-4 text-accent" aria-hidden="true" />Send email</a>
                    <button role="menuitem" type="button" onClick={() => void copy(user.email!, 'Email address copied')} className={menuItemClass}><Copy className="size-4 text-accent" aria-hidden="true" />Copy</button>
                </div> : null}
            </div> : null}

            {hasPhone && user.phone ? <div className="relative min-w-0">
                <button type="button" onClick={(event) => toggleMenu('phone', event)} className={`${cardClass} w-full`} aria-haspopup="menu" aria-expanded={openMenu === 'phone'} aria-controls={`${menuBaseId}-phone`}>
                    <Phone className="size-4 shrink-0 text-accent" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate">{user.phone}</span>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line" aria-hidden="true"><MoreHorizontal className="size-4" /></span>
                    <span className="sr-only">Open phone actions</span>
                </button>
                {openMenu === 'phone' ? <div id={`${menuBaseId}-phone`} role="menu" aria-label="Phone actions" onKeyDown={handleMenuKeys} className="absolute right-0 z-50 mt-2 w-52 rounded-2xl border border-line bg-surface p-2 shadow-2xl shadow-black/15">
                    {hasWhatsApp && user.whatsAppNumber ? <a role="menuitem" href={`https://wa.me/${user.whatsAppNumber.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" onClick={() => setOpenMenu(null)} className={menuItemClass}><MessageCircle className="size-4 text-accent" aria-hidden="true" />WhatsApp</a> : null}
                    <a role="menuitem" href={`tel:${user.phone}`} onClick={() => setOpenMenu(null)} className={menuItemClass}><PhoneCall className="size-4 text-accent" aria-hidden="true" />Call</a>
                    <button role="menuitem" type="button" onClick={downloadContact} className={menuItemClass}><ContactRound className="size-4 text-accent" aria-hidden="true" />Add to contacts</button>
                    <button role="menuitem" type="button" onClick={() => void copy(user.phone!, 'Phone number copied')} className={menuItemClass}><Copy className="size-4 text-accent" aria-hidden="true" />Copy</button>
                </div> : null}
            </div> : null}
        </div>
        <p className="sr-only" aria-live="polite">{status}</p>
    </section>;
}
