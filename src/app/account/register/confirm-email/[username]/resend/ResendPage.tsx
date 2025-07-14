'use client';

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/store/hooks";
import { resendEmail } from "@/lib/apis/account/resendEmail";

const ResendPage = () => {

    const { username } = useParams<{username: string }>();
    var router = useRouter();
    var dispatch = useAppDispatch();
    
    useEffect(() => {
        if (!username) return;
    
        dispatch(resendEmail({
            username,
        }));
    
        router.push(`/account/register/confirm-email/${username}`);
    }, [username]);

    return <></>;
}

export default ResendPage;