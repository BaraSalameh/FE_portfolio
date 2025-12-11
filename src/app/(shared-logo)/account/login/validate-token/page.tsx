'use client';

import { Loading } from "@/components";
import { logout, validateToken } from "@/lib/client-actions/auth.actions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function page() {
    const router = useRouter();

    useEffect(() => {
        const refreshToken = async () => {
            const result = await validateToken();

            if(result.error) await logout();
            
            router.push('/account/login');
        }

        refreshToken();
    }, []);

    return (<Loading isLoading={true} />)
}