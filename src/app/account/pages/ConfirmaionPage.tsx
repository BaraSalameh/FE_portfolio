'use client';

import { Anchor } from "@/components/ui/form/Anchor";
import { Main } from "@/components/shared/Main";
import { SubFooter } from "@/components/shared/SubFooter";
import { Paragraph } from "@/components/ui/Paragraph";
import React, { useEffect } from "react";
import { cn, List, ResponsiveIcon } from "@/components";
import { Home, Send } from "lucide-react";
import { widgetCard } from "@/styles";
import { useParams } from "next/navigation";
import { clearAuth } from "@/lib/store/slices/authSlice";
import { useAppDispatch } from "@/lib/store/hooks";

const ConfirmationPage = () => {

    const { username } = useParams<{username: string }>();
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        dispatch(clearAuth());
    }, []);

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
                <Anchor size="xs" url={`${username ? `/account/register/confirm-email/${username}/resend` : '/account/login'}`}>
                    <ResponsiveIcon icon={Send} />
                    Resend email
                </Anchor>
            </SubFooter>
        </React.Fragment>
    );
}

export default ConfirmationPage;
