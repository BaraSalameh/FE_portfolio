import { notFound } from 'next/navigation';
import { getDashboard } from '@/features/dashboard/api';
import DashboardStoreProvider from '@/features/dashboard/presentation/DashboardStoreProvider';
import { SettingsPage } from '@/features/dashboard/profile/settings/components';
import { handlePageApiError } from '@/lib/api/page-errors';
import { pathWithSearchParams } from '@/lib/api/auth-navigation';

export default async function OwnerSettingsPage({ params, searchParams }: PageProps<'/[role]/[username]/settings'>) {
    const { role, username } = await params;
    const returnTo = pathWithSearchParams(`/${role}/${username}/settings`, await searchParams);
    if (role.toLowerCase() !== 'owner') notFound();
    let dashboard;
    try {
        dashboard = await getDashboard(role, username);
    } catch (error) {
        handlePageApiError(error, returnTo);
    }
    if (!dashboard) notFound();
    return <DashboardStoreProvider dashboard={dashboard}><SettingsPage /></DashboardStoreProvider>;
}
