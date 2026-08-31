import { notFound } from 'next/navigation';
import { getDashboard } from '@/features/dashboard/dashboard.service';
import DashboardStoreProvider from '@/features/dashboard/presentation/DashboardStoreProvider';
import { ApiError } from '@/lib/definitions/api.definitions';
import DashboardPageClient from './DashboardPageClient';

const DASHBOARD_ROLES = new Set(['owner', 'client']);

export default async function DashboardPage({
    params,
}: PageProps<'/[role]/[username]/dashboard'>) {
    const { role, username } = await params;
    if (!DASHBOARD_ROLES.has(role.toLowerCase())) notFound();

    let dashboard;
    try {
        dashboard = await getDashboard(role, username);
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) notFound();
        throw error;
    }

    if (!dashboard) notFound();

    return (
        <DashboardStoreProvider dashboard={dashboard}>
            <DashboardPageClient />
        </DashboardStoreProvider>
    );
}
