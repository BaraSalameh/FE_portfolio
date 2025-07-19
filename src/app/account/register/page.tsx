'use client';

import Image from "next/image";
import { useAppSelector } from "@/lib/store/hooks";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { widgetCard } from "@/styles";
import React from "react";
import { Loading, Main, SubFooter, Anchor, cn } from "@/components";
import { RegisterForm } from "@/features";

const RegisterPage = () => {

    var router = useRouter();
    const { loading, username, isConfirmed } = useAppSelector((state) => state.auth);

    useEffect(() => {
        username && isConfirmed === false && router.push(`/account/register/confirm-email/${username}`);
    }, [username])

    return (
        <React.Fragment>
            <Loading isLoading={loading} />
            <Main paddingY='none'>
                <section className={cn(widgetCard({ scroll: true }))}>
                    <RegisterForm />
                </section>
            </Main>
            <SubFooter>
                <Anchor size="xs" url="/">
                    <Image src="/file.svg" alt="File icon" width={16} height={16} />
                    Go home
                </Anchor>
                <Anchor size="xs" url="/account/login">
                    <Image src="/window.svg" alt="Window icon" width={16} height={16} />
                    I Do have an account! Login.
                </Anchor>
            </SubFooter>
        </React.Fragment>
    );
}

export default RegisterPage;
