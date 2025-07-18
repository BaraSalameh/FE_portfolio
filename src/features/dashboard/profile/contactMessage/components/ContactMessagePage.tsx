'use client';

import { useAppSelector } from "@/lib/store/hooks";
import { ControlledWidget, Paragraph } from "@/components";
import React from "react";
import { useContactMessageWidget, useLoadContactMessageData } from "../hooks";

export const ContactMessagePage = () => {

    const { lstMessages } = useAppSelector(state => state.contactMessage);
    useLoadContactMessageData(lstMessages);
    const contactMessageWidget = useContactMessageWidget();

    return (
        lstMessages.length > 0
            ?   <ControlledWidget
                    {...contactMessageWidget}
                />
            :   <Paragraph size='sm'>{"No messages found"}</Paragraph>
    )
}