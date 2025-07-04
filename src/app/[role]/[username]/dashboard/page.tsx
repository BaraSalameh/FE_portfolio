'use client';

import { useAppSelector } from "@/lib/store/hooks";
import React, { useMemo } from "react";
import { ProfileFormData } from "@/lib/schemas";
import { useParams } from "next/navigation";
import { WithSkeleton, Main, StaticBackground, Profile } from "@/components";
import { useLoadUserData } from "./handlers";
import { useWidgets } from "./hooks";

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

    return (
        <>
        <Profile user={currentUser.user as ProfileFormData} unreadContactMessageCount={unreadContactMessageCount} />
        <WithSkeleton isLoading={!currentUser.user || currentUser.isLoading} skeleton={<StaticBackground />}>
            <Main>
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-3 w-full">
                    {widgets}
                </div>
            </Main>
        </WithSkeleton>
        </>
    );
}