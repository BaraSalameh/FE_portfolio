'use client';

import { Loading } from "@/components";
import { logout, validateToken } from "@/lib/client-actions/auth.actions";
import { paths } from "@/lib/pathHelper";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function page() {
    const router = useRouter();

    useEffect(() => {
        const refreshToken = async () => {
            const result = await validateToken();

            if(!result.success) await logout()
            
            router.push(paths.root.auth.login.path());
        }

        refreshToken();
    }, []);

    return (<Loading isLoading={true} message="Extending your session, please wait..." />)
}