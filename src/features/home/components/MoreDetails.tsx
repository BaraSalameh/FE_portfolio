import { Anchor, Container, Header, ImageSlider, List, Main, Paragraph, ResponsiveIcon, SubFooter } from "@/components";
import { static_more_details_page } from "@/lib/utils";
import { Home, LogIn, FileEditIcon } from "lucide-react";

export const MoreDetails = () => {
    return (
        <Container>
            <div id="more-details" />
            <Main className='items-center sm:items-start'>
                <Paragraph text='justify'>
                    {static_more_details_page.introduction}
                </Paragraph>
                <div className="md:flex w-full gap-5 space-y-5">
                    <List as='ul'>
                        {static_more_details_page.list_label}
                        {static_more_details_page.list.map((p, idx) => <li key={idx}>{p}</li>)}
                    </List>
                    <ImageSlider imageList={static_more_details_page.slider} />
                </div>
                <Paragraph text='justify'>
                    {static_more_details_page.abstract}
                </Paragraph>
            </Main>
            <SubFooter>
                <Anchor url="#home">
                    <ResponsiveIcon icon={Home} />
                    Go Home
                </Anchor>
                <Anchor url="/account/login">
                    <ResponsiveIcon icon={LogIn} />
                    Login
                </Anchor>
                <Anchor url="/account/register">
                    <ResponsiveIcon icon={FileEditIcon} />
                    Register
                </Anchor>
            </SubFooter>
        </Container>
    )
}