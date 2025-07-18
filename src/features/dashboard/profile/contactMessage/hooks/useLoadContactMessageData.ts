"use client";

import { useAppDispatch } from "@/lib/store/hooks";
import { useEffect } from "react";
import { contactMessageListQuery } from "../api/contacMessageListQuery";

export const useLoadContactMessageData = (messages: any) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        !(Array.isArray(messages) && messages.length > 0) && dispatch(contactMessageListQuery({page: 0}));
    }, []);
};