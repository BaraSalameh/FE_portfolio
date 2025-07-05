'use client'
import { Button, Anchor } from "@/components/ui/form";
import { ResponsiveIcon, SearchBar } from "@/components/ui";
import Image from "next/image";
import { useState } from 'react';
import { home } from "@/lib/constants";
import { Paragraph, List } from "@/components/ui";
import { Container } from "@/components/shared/Container";
import { Header } from "@/components/shared/Header";
import { Main } from "@/components/shared/Main";
import { SubFooter } from "@/components/shared/SubFooter";
import { BlurBackground } from "@/components/ui";
import { Contact, File, MoreHorizontal, Search } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function Home() {
    const [searchOpen, setSearchOpen] = useState(false);

    const handleFocus = () => {
        setSearchOpen(true);
    };

    const handleClose = () => {
        setSearchOpen(false);
    };

    return (
        <>
           {searchOpen && (
                <BlurBackground intent='sm' onClick={handleClose}>
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="z-10 sm:w-full max-w-md"
                    >
                        <SearchBar />
                    </div>
                </BlurBackground>
            )}
            {/* Main content */}
            <Container>
                <Header className="relative">
                    <Image
                        src='/portfolio-logo.svg'
                        alt="portfolio logo"
                        width={300}
                        height={40}
                        priority
                    />
                    <div className="absolute right-7 sm:right-10 lg:right-15 bottom-0">
                        <ThemeToggle />
                    </div>
                </Header>
                <Main  className='sm:items-start items-center'>
                    <Paragraph size="xl" position='center' className="w-full">
                        {home.introduction}
                    </Paragraph>
                    <Paragraph size='lg'>
                        {home.subtext}
                    </Paragraph>
                    <List>
                        How it works:
                        {home.list.map((p, idx) => <li key={idx}>{p}</li>)}
                    </List>
                    <Paragraph>
                        {home.abstract}
                    </Paragraph>
                    <div className="flex gap-4 items-center flex-col sm:flex-row">
                        <Button size="lg" rounded="full" onClick={handleFocus}>
                            <ResponsiveIcon icon={Search} />
                            <Paragraph>Start searching</Paragraph>
                        </Button>
                        <Button url="/account/login" size="lg" rounded="full">
                            <Paragraph>Login</Paragraph>
                        </Button>
                        <Button url="/account/register" size="lg" rounded="full">
                            <Paragraph>Register</Paragraph>
                        </Button>
                    </div>
                </Main>
                <SubFooter>
                    <Anchor size="xs" url="/more-details">
                        <ResponsiveIcon icon={MoreHorizontal} />
                        More details
                    </Anchor>
                    {/* <Anchor size="xs" url="#">
                        <ResponsiveIcon icon={File} />
                        Examples
                    </Anchor>
                    <Anchor size="xs" url="#">
                        <ResponsiveIcon icon={Contact} />
                        Contact us →
                    </Anchor> */}
                </SubFooter>
            </Container>
        </>
    );
}
