'use client'
import { Anchor, Container, Header, ImageSlider, List, Main, Paragraph, ResponsiveIcon, SubFooter } from "@/components";
import { static_more_details_page } from "@/lib/utils";
import { Home, LogIn, FileEditIcon } from "lucide-react";

export const MoreDetails = () => {
    return (
        <Container>
            <div id="more-details" />
            <Main className='items-center sm:items-start'>
                <Paragraph size='lg' text='justify'>
                    {static_more_details_page.introduction}
                </Paragraph>
                <div className="md:flex w-full gap-5 space-y-5">
                    <List as='ul'>
                        {static_more_details_page.list_label}
                        {static_more_details_page.list.map((p, idx) => <li key={idx}>{p}</li>)}
                    </List>
                    <ImageSlider imageList={static_more_details_page.slider} />
                </div>
                <Paragraph size='lg' text='justify'>
                    {static_more_details_page.abstract}
                </Paragraph>
            </Main>
            <SubFooter>
                <Anchor size="xs" url="#">
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