import { Button } from "@/components/forms";
import Image from "next/image";
import { static_home_page } from "@/lib/utils";
import { Paragraph, List, Container, Header, Main } from "@/components";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SearchBarPage } from "@/features";

export const Home = () => {
    return (
        <Container>
            <div id="home" />
            <Header>
                <Image
                    src='/portfolio-logo.svg'
                    alt="portfolio logo"
                    width={300}
                    height={80}
                    priority
                />
            </Header>
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
                        <SearchBarPage />
                        <Button url="/account/login" rounded="full">
                            <Paragraph>Login</Paragraph>
                        </Button>
                        <Button url="/account/register" rounded="full">
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
        </Container>
    );
}