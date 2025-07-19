'use client'

import { Header, Container } from "@/components";
import Image from "next/image";

export default function AccountLayout({children}: Readonly<{children: React.ReactNode;}>) {

    return (
        <div>
            <Container>
                <Header>
                    <Image
                        src='/portfolio-logo.svg'
                        alt="portfolio logo"
                        width={300}
                        height={40}
                        priority
                    />
                </Header>
                {children}
            </Container>
        </div>
    );
};