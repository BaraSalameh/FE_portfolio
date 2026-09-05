import type { ProfileFormData } from '@/features/dashboard/profile/schema';
import { paths } from '@/lib/pathHelper';
import { cn } from '@/lib/ui/cn';
import { MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { AccountDropdown } from './AccountDropdown';

type OwnerHeaderActionsProps = {
    user: ProfileFormData;
    unreadMessageCount?: number;
    inverted?: boolean;
    className?: string;
};

export function OwnerHeaderActions({ user, unreadMessageCount = 0, inverted = false, className }: OwnerHeaderActionsProps) {
    if (!user.username) return null;

    return <div className={cn('flex items-center gap-2', className)}>
        <div className="relative">
            <Link
                href={paths.root.messages('owner', user.username).path()}
                className={cn(
                    'grid size-11 place-items-center rounded-xl border shadow-sm transition',
                    inverted ? 'border-white/20 bg-black/25 text-white backdrop-blur-md hover:bg-black/35' : 'border-line bg-surface-raised text-ink-muted hover:border-accent/30 hover:text-ink',
                )}
                aria-label={unreadMessageCount > 0 ? `Messages, ${unreadMessageCount} unread` : 'Messages'}
            >
                <MessageCircle className="size-4" aria-hidden="true" />
            </Link>
            {unreadMessageCount > 0 ? <span className={cn('absolute right-1 top-1 size-2 rounded-full bg-highlight', inverted ? 'ring-2 ring-black/30' : 'ring-2 ring-surface')} aria-hidden="true" /> : null}
        </div>
        <AccountDropdown user={user} inverted={inverted} />
    </div>;
}
