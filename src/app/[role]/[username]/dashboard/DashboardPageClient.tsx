'use client';

import { ControlledWidget, Main, Paragraph, WithSkeleton } from '@/components';
import { StaticBackgroundV2 } from '@/components/layout/StaticBackground';
import ButtonClient from '@/components/ui/ButtonClient';
import { useLoadUserData } from '@/features/dashboard/hooks';
import { ProfilePage } from '@/features/dashboard/profile/components';
import { ProfileFormData } from '@/features/dashboard/profile/schema';
import { useOverviewWidget } from '@/features/dashboard/widgets/overview/hooks';
import { useWidgets } from '@/features/dashboard/widgets/useWidgets';
import { Role } from '@/features/types.features';
import { useAppSelector } from '@/lib/store/hooks';
import { checkWidgetPreferences, widget_preferences } from '@/lib/utils';
import { useParams } from 'next/navigation';

export default function DashboardPageClient() {
    const { error, loading, user } = useAppSelector(state => state.profile);
    const { unreadContactMessageCount } = useAppSelector(state => state.contactMessage);
    const { lstUserPreferences } = useAppSelector(state => state.userWidgetPreference);
    const { role, username } = useParams<{ role: Role; username: string }>();

    useLoadUserData(role, username);
    const widgets = useWidgets();
    const overviewData = useOverviewWidget();
    const showOverview = checkWidgetPreferences(
        lstUserPreferences,
        widget_preferences.key.show_overview_widget,
    );

    if (error) {
        return (
            <Main>
                <div className="mx-auto max-w-lg space-y-4 text-center">
                    <Paragraph>{error}</Paragraph>
                    <ButtonClient onClick={() => window.location.reload()}>Try again</ButtonClient>
                </div>
            </Main>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-5 px-10 pt-5 sm:grid-cols-2 lg:grid-cols-3">
                <ProfilePage
                    user={user as ProfileFormData}
                    unreadContactMessageCount={unreadContactMessageCount}
                    className={`col-span-3 ${showOverview ? 'sm:col-span-2' : 'sm:col-span-3'}`}
                />
                {showOverview ? (
                    <ControlledWidget className="col-span-3 sm:col-span-1" {...overviewData} />
                ) : null}
            </div>
            <WithSkeleton isLoading={!user || loading} skeleton={<StaticBackgroundV2 />}>
                <Main>
                    <div className="w-full columns-1 gap-4 space-y-3 sm:columns-2 lg:columns-3">
                        {widgets}
                    </div>
                </Main>
            </WithSkeleton>
        </>
    );
}
