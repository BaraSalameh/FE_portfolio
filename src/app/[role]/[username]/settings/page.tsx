import { notFound } from 'next/navigation';
import { getDashboard } from '@/features/dashboard/api';
import DashboardStoreProvider from '@/features/dashboard/presentation/DashboardStoreProvider';
import { SettingsPage } from '@/features/dashboard/profile/settings/components';
import { handlePageApiError } from '@/lib/api/page-errors';

export default async function OwnerSettingsPage({ params }: { params: Promise<{ role: string; username: string }> }) {
    const { role, username } = await params;
    if (role.toLowerCase() !== 'owner') notFound();
    let dashboard;
    try {
        dashboard = await getDashboard(role, username);
    } catch (error) {
        handlePageApiError(error);
    }
    if (!dashboard) notFound();
    return <DashboardStoreProvider dashboard={dashboard}><SettingsPage /></DashboardStoreProvider>;
}
