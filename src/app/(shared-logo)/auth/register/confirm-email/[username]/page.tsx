import React from "react";
import { Paragraph, SubFooter, Main, Anchor } from "@/components";
import { cn, List, ResponsiveIcon } from "@/components";
import { Home, Send } from "lucide-react";
import { widgetCard } from "@/styles";
import { paths } from "@/lib/pathHelper";

export const Page = async (
    props: {
        params?: Promise<{
            username?: string;
        }>
    }
) => {

    const params = await props.params;
    const username = params?.username;

    if(!username) return;

    return (
        <React.Fragment>
            <Main>
                <div className={cn(widgetCard())}>
                    <Paragraph>
                        We've sent a confirmation link to your email address.{'\n'}
                        Please check your inbox and click the confirm button to verify your email.{'\n\n'}
                    </Paragraph>

                    <List className="text-sm">
                        <Paragraph>If you don't see the email:</Paragraph>
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
                <Anchor url={paths.root.path()}>
                    <ResponsiveIcon icon={Home} />
                    Go home
                </Anchor>
                <Anchor url={paths.root.auth.register.confirmEmail(username).resend.path()}>
                    <ResponsiveIcon icon={Send} />
                    Resend email
                </Anchor>
            </SubFooter>
        </React.Fragment>
    );
}

export default Page;