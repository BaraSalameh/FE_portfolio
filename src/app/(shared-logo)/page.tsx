import { Button, List, Main, Paragraph, ThemeToggle } from '@/components';
import { paths } from '@/lib/pathHelper';
import { static_home_page } from '@/lib/utils';
import Image from 'next/image';
import React from 'react';

const Page = async () => {

    return (
        <Main direction='row'>
            <section className="space-y-5">
                <ThemeToggle darkLabel="Use Light Theme" lightLabel="Use Dark Theme" />
                <Paragraph className="text-lg">
                    {static_home_page.introduction}
                </Paragraph>
                <List>
                    How it works:
                    {static_home_page.list.map((p, idx) => <li key={idx}>{p}</li>)}
                </List>
                <Paragraph className="text-sm">
                    {static_home_page.abstract}
                </Paragraph>
                <div className="flex gap-4 items-center flex-col sm:flex-row w-full">
                    <Button url={paths.root.search.path()} rounded="full">
                        <Paragraph>Search</Paragraph>
                    </Button>
                    <Button url={paths.root.auth.login.path()} rounded="full">
                        <Paragraph>Login</Paragraph>
                    </Button>
                    <Button url={paths.root.auth.register.path()} rounded="full">
                        <Paragraph>Register</Paragraph>
                    </Button>
                </div>
            </section>
            <section>
                <Image
                    src='/hero-desktop.png'
                    alt="Screenshots of the Portfolio project showing desktop version"
                    width={1600}
                    height={800}
                    className="hidden md:block"
                    priority
                />
            </section>
        </Main>
    );
}

export default Page;