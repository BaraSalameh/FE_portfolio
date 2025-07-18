"use client";

import { userByUsernameQuery, userFullInfoQuery } from "@/features";
import { Role } from "@/features/types";
import { useAppDispatch } from "@/lib/store/hooks";
import { useEffect } from "react";

export const useLoadUserData = (role: Role, username: string) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        switch (role) {
            case 'owner':
                dispatch(userFullInfoQuery());
                break;
            case 'client':
                dispatch(userByUsernameQuery(username));
                break;
        }
    }, [dispatch]);
};