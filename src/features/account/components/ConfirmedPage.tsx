'use client';

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import { confirmEmail } from "@/features";

export const ConfirmedPage = () => {

    const searchParams = useSearchParams();
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    var router = useRouter();
    var dispatch = useAppDispatch();
    
    useEffect(() => {
        if (!token || !email) return;
        
        const confirm = async () => {
            await dispatch(confirmEmail({ email, token }));
            router.push('/account/login');
        }
        
        confirm();
    }, [token, email]);

    return <></>;
};