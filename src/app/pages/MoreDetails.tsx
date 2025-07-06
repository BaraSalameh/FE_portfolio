'use client'
import { Anchor, Container, Header, ImageSlider, List, Main, Paragraph, ResponsiveIcon, SubFooter } from "@/components";
import { more_details } from "@/lib/constants";
import { Home, LogIn, FileEditIcon } from "lucide-react";

const MoreDetails = () => {
    return (
        <Container>
            <div id="more-details" />
            <Main className='items-center sm:items-start'>
                <Paragraph size='lg' text='justify'>
                    {more_details.introduction}
                </Paragraph>
                <div className="md:flex w-full gap-5 space-y-5">
                    <List as='ul'>
                        {more_details.list_label}
                        {more_details.list.map((p, idx) => <li key={idx}>{p}</li>)}
                    </List>
                    <ImageSlider imageList={more_details.slider} />
                </div>
                <Paragraph size='lg' text='justify'>
                    {more_details.abstract}
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

export default MoreDetails;