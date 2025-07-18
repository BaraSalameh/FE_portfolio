'use client'
import { Button, Anchor } from "@/components/ui/form";
import { ImageSlider, ResponsiveIcon } from "@/components/ui";
import Image from "next/image";
import { home } from "@/lib/constants";
import { Paragraph, List } from "@/components/ui";
import { Container } from "@/components/shared/Container";
import { Header } from "@/components/shared/Header";
import { Main } from "@/components/shared/Main";
import { SubFooter } from "@/components/shared/SubFooter";
import { Contact, File, MoreHorizontal } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SearchBarPage } from "@/features";

export const Home = () => {

    return (
        <>
            {/* Main content */}
            <Container className="min-h-screen">
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
                <Main itemsX='start'>
                    <ImageSlider imageList={home.slider} />
                    <Paragraph size="xl" className="w-full">
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
                    <div className="flex gap-4 items-center flex-col sm:flex-row w-full">
                        <SearchBarPage />
                        <Button url="/account/login" size="lg" rounded="full">
                            <Paragraph>Login</Paragraph>
                        </Button>
                        <Button url="/account/register" size="lg" rounded="full">
                            <Paragraph>Register</Paragraph>
                        </Button>
                    </div>
                </Main>
                <SubFooter>
                    <Anchor size="xs" url="#more-details">
                        <ResponsiveIcon icon={MoreHorizontal} />
                        More details
                    </Anchor>
                    <Anchor size="xs" url="#examples">
                        <ResponsiveIcon icon={File} />
                        Examples
                    </Anchor>
                    <Anchor size="xs" url="#contact-us">
                        <ResponsiveIcon icon={Contact} />
                        Contact us →
                    </Anchor>
                </SubFooter>
            </Container>
        </>
    );
}