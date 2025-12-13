import Image from "next/image";
import { widgetCard } from "@/styles/widget";
import React from "react";
import { Main, SubFooter, Anchor, cn } from "@/components";
import { LoginForm } from '@/components/auth/login/LoginForm';
import { paths } from "@/lib/pathHelper";

const LoginPage = async () => {
    return (
        <React.Fragment>
            <Main>
                <section className={cn(widgetCard(), 'w-full md:w-2/3 lg:w-1/3')}>
                    <LoginForm />
                </section>
            </Main>
            <SubFooter>
                <Anchor url={paths.root.path()}>
                    <Image src="/file.svg" alt="File icon" width={16} height={16} />
                    Go home
                </Anchor>
                <Anchor url={paths.root.auth.register.path()}>
                    <Image src="/window.svg" alt="Window icon" width={16} height={16} />
                    Don't have an account? Register!
                </Anchor>
            </SubFooter>
        </React.Fragment>
    );
}

export default LoginPage;
