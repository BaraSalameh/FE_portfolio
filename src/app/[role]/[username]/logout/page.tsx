'use client';

import { Loading } from "@/components";
import { logout } from "@/features";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {

    const dispatch = useAppDispatch();
    const router = useRouter();
    const { loading } = useAppSelector(state => state.auth);

    useEffect(() => {
        dispatch(logout());
        router.push('/');
    }, []);

    return (
        <Loading message="Logging out..." isLoading={loading} />
    );
}
