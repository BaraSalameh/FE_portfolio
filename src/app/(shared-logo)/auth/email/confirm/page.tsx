'use client'

import { Loading } from "@/components";
import { confirmEmail } from "@/lib/client-actions/auth.actions";
import { paths } from "@/lib/pathHelper";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token') as string;

    var router = useRouter();
    
    useEffect(() => {
        const confirm = async () => {
            const result = await confirmEmail(token);

            if (result.success) {
                router.push(paths.root.auth.login.path());
            } else {
                router.push(paths.root.auth.email.path());
            }
        }
        
        confirm();
    }, [token]);

    return (
        <Loading isLoading={true} message="Autheniticating your account, please wait..." />
    );
}

export default Page;