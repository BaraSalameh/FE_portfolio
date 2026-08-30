import { notFound } from 'next/navigation';
import DashboardPageClient from './DashboardPageClient';

const DASHBOARD_ROLES = new Set(['owner', 'client']);

export default async function DashboardPage({
    params,
}: PageProps<'/[role]/[username]/dashboard'>) {
    const { role } = await params;
    if (!DASHBOARD_ROLES.has(role.toLowerCase())) notFound();

    return <DashboardPageClient />;
}
