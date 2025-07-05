'use client';

import Image from "next/image";
import { Anchor } from "@/components/ui/form/Anchor";
import { Main } from "@/components/shared/Main";
import { SubFooter } from "@/components/shared/SubFooter";
import { Paragraph } from "@/components/ui/Paragraph";
import React from "react";
import { List, ResponsiveIcon } from "@/components";
import { Home, Send } from "lucide-react";

export default function ConfirmEmailPage() {
    return (
        <React.Fragment>
            <Main>
                <div className="bg-light-component dark:bg-dark-component rounded-2xl p-6">
                    <Paragraph size='lg'>
                        We've sent a confirmation link to your email address.{'\n'}
                        Please check your inbox and click the confirm button to verify your email.

                        {'\n\n'}If you don't see the email:{'\n\n'}
                    </Paragraph>
                    <List size="xs">
                        <li>
                            Check your Spam or Junk folder.
                        </li>
                        <li>
                            Make sure you entered the correct email address.
                        </li>
                        <li>
                            You can request a new confirmation email below.
                        </li>
                    </List>
                </div>
            </Main>
            <SubFooter>
                <Anchor size="xs" url="/">
                    <ResponsiveIcon icon={Home} />
                    Go home
                </Anchor>
                <Anchor size="xs" url="/account/register/confirm-email/resend">
                    <ResponsiveIcon icon={Send} />
                    Resend email
                </Anchor>
            </SubFooter>
        </React.Fragment>
    );
}
