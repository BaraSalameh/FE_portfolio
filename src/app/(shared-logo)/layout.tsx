import { Header, Container, Logo } from "@/components";

export default function AccountLayout({children}: Readonly<{children: React.ReactNode;}>) {

    return (
        <div>
            <Container>
                <Header>
                    <Logo />
                </Header>
                {children}
            </Container>
        </div>
    );
};