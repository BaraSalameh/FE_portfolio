"use client";

import { useAppDispatch } from "@/lib/store/hooks";
import { useEffect } from "react";
import { contactMessageListQuery } from "../api/contacMessageListQuery";
import { ContactMessageFormData } from "../schema";

export const useLoadContactMessageData = (messages: ContactMessageFormData[]) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!Array.isArray(messages) || messages.length === 0) {
            dispatch(contactMessageListQuery({page: 0}));
        }
    }, [dispatch, messages]);
};
