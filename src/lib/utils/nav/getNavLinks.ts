import {
    Home, LayoutDashboard, Book, Briefcase, Folder, BadgePercent,
    Languages, PenSquare, MessageSquare, Settings, LogOut
} from 'lucide-react';

export const getNavLinks = (username?: string | undefined, role?: 'owner' | 'client' | 'admin' ) => {
    if (!username) return [{ href: '/', label: 'Home', icon: Home }];

    if (role === 'client' || !role) return [
        { href: '/', label: 'Home', icon: Home },
        { href: `/client/${username}/dashboard`, label: 'Dashboard', icon: LayoutDashboard }
    ];

    if (role === 'owner') return [
        { href: '/', label: 'Home', icon: Home },
        { href: `/owner/${username}/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
        { href: `/owner/${username}/education`, label: 'Education', icon: Book },
        { href: `/owner/${username}/experience`, label: 'Experience', icon: Briefcase },
        { href: `/owner/${username}/project`, label: 'Projects', icon: Folder },
        { href: `/owner/${username}/skill`, label: 'Skills', icon: BadgePercent },
        { href: `/owner/${username}/language`, label: 'Languages', icon: Languages },
        { href: `/owner/${username}/blog-post`, label: 'Blog Post', icon: PenSquare },
        { href: `/owner/${username}/message`, label: 'Messages', icon: MessageSquare },
        { href: `/owner/${username}/setting`, label: 'Settings', icon: Settings },
        { href: `/owner/${username}/logout`, label: 'Logout', icon: LogOut },
    ];

    return [{ href: '/', label: 'Home', icon: Home }];
}