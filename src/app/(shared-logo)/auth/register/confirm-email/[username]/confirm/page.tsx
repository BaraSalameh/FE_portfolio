'use client'

import { Loading } from "@/components";
import { confirmEmail } from "@/lib/client-actions/auth.actions";
import { paths } from "@/lib/pathHelper";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
    const searchParams = useSearchParams();
    const token = searchParams.get('token') as string;
    const email = searchParams.get('email') as string;
    const { username } = useParams();

    var router = useRouter();
    
    useEffect(() => {
        const confirm = async () => {
            const result = await confirmEmail(email, token);

            if (result.success) {
                router.push(paths.root.auth.login.path());
            } else {
                router.push(paths.root.auth.register.confirmEmail(username as string).path());
            }
        }
        
        confirm();
    }, [token, email]);

    return (
        <Loading isLoading={true} message="Autheniticating your account, please wait..." />
    );
}

export default Page;