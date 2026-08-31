'use client';

import { useAppSelector } from "@/lib/store/hooks";
import { DashboardWidget } from '@/features/dashboard/presentation';
import React from "react";
import { useContactMessageWidget, useLoadContactMessageData } from "../hooks";

export const ContactMessagePage = () => {

    const { lstMessages } = useAppSelector(state => state.contactMessage);
    useLoadContactMessageData(lstMessages);
    const contactMessageWidget = useContactMessageWidget();

    return (
        lstMessages.length > 0
            ?   <DashboardWidget
                    {...contactMessageWidget}
                />
            :   <p className="py-6 text-center text-sm text-ink-muted">No messages found</p>
    )
}
