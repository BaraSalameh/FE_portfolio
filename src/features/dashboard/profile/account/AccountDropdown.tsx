'use client';

import type { ProfileFormData } from '@/features/dashboard/profile/schema';
import { paths } from '@/lib/pathHelper';
import { cn } from '@/lib/ui/cn';
import { LogOut, Settings, ShieldCheck, UserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useId, useRef, useState, useTransition } from 'react';

type AccountDropdownProps = {
    user: ProfileFormData;
    className?: string;
    inverted?: boolean;
};

export function AccountDropdown({ user, className, inverted = false }: AccountDropdownProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isLoggingOut, startLogout] = useTransition();
    const containerRef = useRef<HTMLDivElement>(null);
    const menuId = useId();
    const username = user.username ?? '';
    const fullName = `${user.firstname} ${user.lastname}`.trim();
    const profilePicture = user.profilePicture ?? (user.gender === '0' ? '/Default-Female.svg' : '/Default-Male.svg');

    useEffect(() => {
        if (!open) return;
        const closeOnOutsideClick = (event: PointerEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
        };
        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setOpen(false);
        };
        document.addEventListener('pointerdown', closeOnOutsideClick);
        document.addEventListener('keydown', closeOnEscape);
        return () => {
            document.removeEventListener('pointerdown', closeOnOutsideClick);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [open]);

    const handleLogout = () => {
        setOpen(false);
        startLogout(async () => {
            try {
                await fetch('/api/Account/Logout', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: '{}',
                });
            } finally {
                await fetch(paths.root.auth.logout.path(), { method: 'POST' }).catch(() => undefined);
                router.replace(paths.root.auth.login.path());
                router.refresh();
            }
        });
    };

    return <div ref={containerRef} className={cn('relative', className)}>
        <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls={menuId}
            aria-haspopup="menu"
            aria-label="Open account menu"
            className={cn(
                'grid size-11 place-items-center overflow-hidden rounded-xl border p-0 text-left shadow-sm transition',
                inverted ? 'border-white/20 bg-black/25 text-white hover:bg-black/35' : 'border-line bg-surface-raised text-ink hover:border-accent/30',
            )}
        >
            <span className="relative size-full bg-canvas-subtle">
                <Image src={profilePicture} alt="" fill className="object-cover" sizes="44px" />
            </span>
        </button>

        {open ? <div id={menuId} role="menu" aria-label="Account" className="absolute right-0 z-40 mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-line bg-surface p-2 text-ink shadow-2xl shadow-black/20">
            <div className="flex items-center gap-3 border-b border-line px-3 py-3">
                <span className="relative size-11 shrink-0 overflow-hidden rounded-xl bg-canvas-subtle">
                    <Image src={profilePicture} alt="" fill className="object-cover" sizes="44px" />
                </span>
                <span className="min-w-0"><span className="block truncate text-sm font-bold">{fullName || 'Portfolio owner'}</span><span className="mt-0.5 block truncate text-xs text-ink-muted">{user.email || user.title || 'Account'}</span></span>
            </div>
            <div className="py-2">
                <Link role="menuitem" href={paths.root.profile('owner', username).path()} onClick={() => setOpen(false)} className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-ink-muted transition hover:bg-canvas-subtle hover:text-ink"><UserRound className="size-4 text-accent" aria-hidden="true" /> Edit profile</Link>
                <Link role="menuitem" href={paths.root.settings('owner', username).path()} onClick={() => setOpen(false)} className="flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold text-ink-muted transition hover:bg-canvas-subtle hover:text-ink"><Settings className="size-4 text-accent" aria-hidden="true" /> Settings</Link>
                <button role="menuitem" type="button" aria-disabled="true" title="Coming in a future account update" className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold text-ink-muted/60"><ShieldCheck className="size-4" aria-hidden="true" /><span>Account &amp; security</span><span className="ml-auto text-[0.65rem] font-bold uppercase tracking-wider">Soon</span></button>
            </div>
            <div className="border-t border-line pt-2">
                <button role="menuitem" type="button" onClick={handleLogout} disabled={isLoggingOut} className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-bold text-danger transition hover:bg-danger/8 disabled:opacity-60"><LogOut className="size-4" aria-hidden="true" /> {isLoggingOut ? 'Logging out…' : 'Log out'}</button>
            </div>
        </div> : null}
    </div>;
}
