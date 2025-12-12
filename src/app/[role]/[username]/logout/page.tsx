'use client';

import { Loading } from "@/components";
import { logout } from "@/lib/client-actions/auth.actions";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
    const router = useRouter();

    useEffect(() => {
        const logoutAction = async () =>{
            await logout();
            router.push('/account/login');
        }

        logoutAction();
    }, []);

    return (
        <Loading isLoading={true} />
    );
}

export default Page;