'use client'

import { Loading } from "@/components";
import { confirmEmail } from "@/lib/client-actions/auth.actions";
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

            if (result?.error) router.push(`/account/register/confirm-email/${username}`);
            
            router.push('/account/login');
        }
        
        confirm();
    }, [token, email]);

    return (
        <Loading isLoading={true} />
    );
}

export default Page;