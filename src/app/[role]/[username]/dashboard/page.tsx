import { notFound } from 'next/navigation';
import { getDashboard } from '@/features/dashboard/api';
import DashboardStoreProvider from '@/features/dashboard/presentation/DashboardStoreProvider';
import { handlePageApiError } from '@/lib/api/page-errors';
import DashboardPageClient from './DashboardPageClient';
import { pathWithSearchParams } from '@/lib/api/auth-navigation';

const DASHBOARD_ROLES = new Set(['owner', 'client']);

export default async function DashboardPage({
    params,
    searchParams,
}: PageProps<'/[role]/[username]/dashboard'>) {
    const { role, username } = await params;
    const returnTo = pathWithSearchParams(`/${role}/${username}/dashboard`, await searchParams);
    if (!DASHBOARD_ROLES.has(role.toLowerCase())) notFound();

    let dashboard;
    try {
        dashboard = await getDashboard(role, username);
    } catch (error) {
        handlePageApiError(error, returnTo);
    }

    if (!dashboard) notFound();

    return (
        <DashboardStoreProvider dashboard={dashboard}>
            <DashboardPageClient />
        </DashboardStoreProvider>
    );
}
