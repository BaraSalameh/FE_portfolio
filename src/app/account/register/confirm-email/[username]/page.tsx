'use client';

import Image from "next/image";
import { Anchor } from "@/components/ui/form/Anchor";
import { Main } from "@/components/shared/Main";
import { SubFooter } from "@/components/shared/SubFooter";
import { Paragraph } from "@/components/ui/Paragraph";
import React from "react";
import { cn, List, ResponsiveIcon } from "@/components";
import { Home, Send } from "lucide-react";
import { useParams } from "next/navigation";
import { widgetCard } from "@/styles";

export default function ConfirmEmailPage() {

    const { username } = useParams<{username: string }>();

    return (
        <React.Fragment>
            <Main>
                <div className={cn(widgetCard())}>
                    <Paragraph size='lg'>
                        We've sent a confirmation link to your email address.{'\n'}
                        Please check your inbox and click the confirm button to verify your email.{'\n\n'}
                    </Paragraph>

                    <List size="xs">
                        <Paragraph size='lg'>If you don't see the email:</Paragraph>
                        <li>
                            Check your Spam or Junk folder.
                        </li>
                        <li>
                            Make sure you entered the correct email address.
                        </li>
                        <li>
                            If you've been redirected from registration page, You can request a new confirmation email below.
                        </li>
                    </List>
                </div>
            </Main>
            <SubFooter>
                <Anchor size="xs" url="/">
                    <ResponsiveIcon icon={Home} />
                    Go home
                </Anchor>
                <Anchor size="xs" url={`/account/register/confirm-email/${username}/resend`}>
                    <ResponsiveIcon icon={Send} />
                    Resend email
                </Anchor>
            </SubFooter>
        </React.Fragment>
    );
}
