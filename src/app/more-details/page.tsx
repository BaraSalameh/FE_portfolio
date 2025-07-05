'use client'
import { Anchor, Container, Header, List, Main, Paragraph, ResponsiveIcon, SubFooter } from "@/components";
import { more_details } from "@/lib/constants";
import { Home, LogIn, FileEditIcon } from "lucide-react";
import Image from "next/image";

const MoreDetails = () => {
    return (
        <Container>
            <Header className="relative">
                <Image
                    src='/portfolio-logo.svg'
                    alt="portfolio logo"
                    width={300}
                    height={40}
                    priority
                />
            </Header>
            <Main className='items-center sm:items-start'>
                <Paragraph text='justify'>
                    {more_details.introduction}
                </Paragraph>
                <List size="sm" as='ul'>
                    {more_details.list_label}
                    {more_details.list.map((p, idx) => <li key={idx}>{p}</li>)}
                </List>
                <Paragraph text='justify'>
                    {more_details.abstract}
                </Paragraph>
            </Main>
            <SubFooter>
                <Anchor size="xs" url="/">
                    <ResponsiveIcon icon={Home} />
                    Go Home
                </Anchor>
                <Anchor size="xs" url="/account/login">
                    <ResponsiveIcon icon={LogIn} />
                    Login
                </Anchor>
                <Anchor size="xs" url="/account/register">
                    <ResponsiveIcon icon={FileEditIcon} />
                    Register
                </Anchor>
            </SubFooter>
        </Container>
    )
}

export default MoreDetails;