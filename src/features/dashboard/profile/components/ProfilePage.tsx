'use client';

import { OwnerHeaderActions } from '@/features/dashboard/profile/account';
import { ProfileForm } from '@/features/dashboard/profile/forms';
import { useAppSelector } from '@/lib/store/hooks';
import { paths } from '@/lib/pathHelper';
import { ArrowLeft, Contact, UserRound } from 'lucide-react';
import Link from 'next/link';

export function ProfilePage() {
    const user = useAppSelector((state) => state.profile.user);
    const unreadMessageCount = useAppSelector((state) => state.contactMessage.unreadContactMessageCount);
    if (!user) return null;

    const username = user.username ?? '';
    return <main className="min-h-svh bg-canvas px-4 py-5 text-ink sm:px-8 sm:py-8"><div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-4"><Link href={paths.root.dashboard('owner', username).path()} className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-bold text-ink-muted transition hover:bg-surface hover:text-ink"><ArrowLeft className="size-4" aria-hidden="true" /> Back to dashboard</Link><OwnerHeaderActions user={user} unreadMessageCount={unreadMessageCount} /></div>

        <header className="mt-4 rounded-[1.75rem] border border-line bg-surface p-6 shadow-lg shadow-black/5 sm:p-8"><div className="flex items-start gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-white shadow-lg shadow-accent/20"><UserRound className="size-5" aria-hidden="true" /></span><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Account</p><h1 className="mt-1 text-3xl font-bold tracking-[-0.05em] sm:text-4xl">Profile</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-ink-muted sm:text-base">Manage the personal details and images shown on your public portfolio.</p></div></div></header>

        <div className="mt-6 space-y-6">
            <section className="rounded-2xl border border-line bg-surface p-5 shadow-sm sm:p-7"><div className="flex items-start gap-3"><span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent-soft text-accent-strong"><Contact className="size-4" aria-hidden="true" /></span><div><h2 className="text-xl font-bold tracking-[-0.035em]">Profile information</h2><p className="mt-1 text-sm leading-6 text-ink-muted">Update the personal details shown on your public portfolio.</p></div></div>
                <div className="mt-6 border-t border-line pt-6"><ProfileForm /></div>
            </section>
        </div>
    </div></main>;
}
