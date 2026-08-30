"use client";

import { userByUsernameQuery, userFullInfoQuery } from "../apis";
import { Role } from "@/features/types.features";
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
    }, [dispatch, role, username]);
};
