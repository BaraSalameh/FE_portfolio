'use client';

import { useAppSelector } from "@/lib/store/hooks";
import React from "react";
import { useParams } from "next/navigation";
import { WithSkeleton, Main, ControlledWidget } from "@/components";
import { StaticBackgroundV2 } from "@/components/layout/StaticBackground";
import { checkWidgetPreferences } from "@/lib/utils";
import { widget_preferences } from "@/lib/utils";
import { ProfileFormData } from "@/features/dashboard/profile/schema";
import { useWidgets } from "@/features/dashboard/widgets/useWidgets";
import { useOverviewWidget } from "@/features/dashboard/widgets/overview/hooks";
import { ProfilePage, useLoadUserData } from "@/features";
import { Role } from "@/features/types.features";

export default function OwnerDashboardPage() {

    const { loading, user } = useAppSelector(state => state.profile);
    const { unreadContactMessageCount } = useAppSelector(state => state.contactMessage);
    const { lstUserPreferences } = useAppSelector(state => state.userWidgetPreference);

    const { role, username } = useParams<{role: Role, username: string }>();

    useLoadUserData(role, username);
    const widgets = useWidgets();
    const overviewData = useOverviewWidget();
    const showOverview = checkWidgetPreferences(lstUserPreferences, widget_preferences.key.show_overview_widget);

    return (
        <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-10 pt-5">
            <ProfilePage
                user={user as ProfileFormData}
                unreadContactMessageCount={unreadContactMessageCount}
                className={`col-span-3 ${showOverview ? 'sm:col-span-2' : 'sm:col-span-3'}`}
            />
            { showOverview &&
                <ControlledWidget
                    className="col-span-3 sm:col-span-1"
                    {...overviewData}
                />
            }
        </div>
        <WithSkeleton isLoading={!user || loading} skeleton={<StaticBackgroundV2 />}>
            <Main>
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-3 w-full">
                    {widgets}
                </div>
            </Main>
        </WithSkeleton>
        </>
    );
}