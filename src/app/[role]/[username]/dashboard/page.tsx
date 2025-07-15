'use client';

import { useAppSelector } from "@/lib/store/hooks";
import React, { useMemo } from "react";
import { ProfileFormData } from "@/lib/schemas";
import { useParams } from "next/navigation";
import { WithSkeleton, Main, StaticBackground, ControlledWidget, ProfileV2, ProfileV1 } from "@/components";
import { useLoadUserData } from "./handlers";
import { useOverviewWidget, useWidgets } from "./hooks";
import { StaticBackgroundV2 } from "@/components/ui/StaticBackground";
import { CheckPreferences } from "@/lib/utils/appFunctions";
import { PREFERENCES } from "@/lib/constants";

export default function OwnerDashboardPage() {

    const { loading: ownerInfoLoading, user: owner } = useAppSelector(state => state.owner);
    const { loading: clientInfoLoading, user: client } = useAppSelector(state => state.client);
    const { unreadContactMessageCount } = useAppSelector(state => state.contactMessage);

    const { role, username } = useParams<{role: 'owner' | 'client' | 'admin', username: string }>();
    const currentUser = useMemo(() => ({
        user: role === 'owner' ? owner : client,
        isLoading: role === 'owner' ? ownerInfoLoading : clientInfoLoading,
    }), [role, owner, client, ownerInfoLoading, clientInfoLoading]);

    useLoadUserData(role, username);
    const widgets = useWidgets();
    const overviewData = useOverviewWidget();
    const showOverview = CheckPreferences(PREFERENCES.KEY.SHOW_OVERVIEW_WIDGET);

    return (
        <>
        {/* <ProfileV1 user={currentUser.user as ProfileFormData} unreadContactMessageCount={unreadContactMessageCount} /> */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 px-10 pt-5">
            <ProfileV2
                user={currentUser.user as ProfileFormData}
                unreadContactMessageCount={unreadContactMessageCount}
                className={`col-span-${showOverview ? '2' : '3'}`}
            />
            { showOverview &&
                <ControlledWidget
                    {...overviewData}
                />
            }
        </div>
        {/* <WithSkeleton isLoading={!currentUser.user || currentUser.isLoading} skeleton={<StaticBackground />}> */}
        <WithSkeleton isLoading={!currentUser.user || currentUser.isLoading} skeleton={<StaticBackgroundV2 />}>
            <Main>
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-3 w-full">
                    {widgets}
                </div>
            </Main>
        </WithSkeleton>
        </>
    );
}