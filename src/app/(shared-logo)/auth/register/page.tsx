import Image from "next/image";
import { widgetCard } from "@/styles";
import React from "react";
import { Main, SubFooter, Anchor, cn } from "@/components";
import { RegisterForm } from "@/components/auth/register/RegisterForm";
import { paths } from "@/lib/pathHelper";

const Page = () => {
    return (
        <React.Fragment>
            <Main paddingY='none'>
                <section className={cn(widgetCard({ scroll: true }), 'w-full md:w-2/3 lg:w-1/3')}>
                    <RegisterForm />
                </section>
            </Main>
            <SubFooter>
                <Anchor url={paths.root.path()}>
                    <Image src="/file.svg" alt="File icon" width={16} height={16} />
                    Go home
                </Anchor>
                <Anchor url={paths.root.auth.login.path()}>
                    <Image src="/window.svg" alt="Window icon" width={16} height={16} />
                    I Do have an account! Login.
                </Anchor>
            </SubFooter>
        </React.Fragment>
    );
}

export default Page;
