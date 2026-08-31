'use client';

import { ProfileFormData } from '@/features/dashboard/profile/schema';
import { DashboardWidget, PortfolioLoading, PortfolioProfile } from '@/features/dashboard/presentation';
import { useOverviewWidget } from '@/features/dashboard/widgets/overview/hooks';
import { useWidgets } from '@/features/dashboard/widgets/useWidgets';
import { useAppSelector } from '@/lib/store/hooks';
import { checkWidgetPreferences, widget_preferences } from '@/lib/utils';

export default function DashboardPageClient() {
    const { error, loading, user } = useAppSelector(state => state.profile);
    const { unreadContactMessageCount } = useAppSelector(state => state.contactMessage);
    const { lstUserPreferences } = useAppSelector(state => state.userWidgetPreference);
    const widgets = useWidgets();
    const overviewData = useOverviewWidget();
    const showOverview = checkWidgetPreferences(
        lstUserPreferences,
        widget_preferences.key.show_overview_widget,
    );

    if (error) {
        return (
            <main className="grid min-h-svh place-items-center bg-canvas px-5 text-ink">
                <div className="w-full max-w-lg rounded-[1.5rem] border border-line bg-surface p-7 text-center shadow-xl shadow-black/5">
                    <h1 className="text-2xl font-bold tracking-[-0.04em]">Portfolio unavailable</h1>
                    <p className="mt-3 text-sm leading-6 text-ink-muted">{error}</p>
                    <button type="button" onClick={() => window.location.reload()} className="mt-6 min-h-11 rounded-full bg-accent px-6 text-sm font-bold text-white hover:bg-accent-strong">Try again</button>
                </div>
            </main>
        );
    }

    if (!user || loading) return <PortfolioLoading />;

    return (
        <main className="min-h-svh bg-canvas px-4 py-4 text-ink sm:px-8 sm:py-6">
            <div className="mx-auto max-w-[88rem]">
                <PortfolioProfile
                    user={user as ProfileFormData}
                    unreadContactMessageCount={unreadContactMessageCount}
                />
                {showOverview && <div className="mt-5"><DashboardWidget {...overviewData} /></div>}
                <div className="mt-5 columns-1 gap-4 sm:columns-2 lg:columns-3">
                    {widgets}
                </div>
            </div>
        </main>
    );
}
