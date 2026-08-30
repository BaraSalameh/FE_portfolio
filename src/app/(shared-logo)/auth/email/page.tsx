import React from "react";
import { Paragraph, SubFooter, Main, Anchor } from "@/components";
import { cn, List, ResponsiveIcon } from "@/components";
import { Home, Send } from "lucide-react";
import { widgetCard } from "@/styles";
import { paths } from "@/lib/pathHelper";

const Page = () => {
    return (
        <React.Fragment>
            <Main>
                <div className={cn(widgetCard())}>
                    <Paragraph >
                        Check your email{'\n'}{'\n'}
                        We&apos;ve sent a confirmation link to your email address.
                        Please open the email and click the link to verify your account.{'\n'}{'\n'}
                    </Paragraph>
                    <List className="text-sm">
                        <Paragraph>Didn&apos;t receive the email?</Paragraph>
                        <li>
                            Check your Spam or Junk folder.
                        </li>
                        <li>
                            Make sure you signed up with the correct email address.
                        </li>
                        <li>
                            You can request a new confirmation email by logging in.
                        </li>
                    </List>
                    <Paragraph intent='secondary' className="text-sm italic mt-2">
                        You can safely close this page. The confirmation link will remain valid for 15 minutes.
                    </Paragraph>
                </div>
            </Main>
            <SubFooter>
                <Anchor url={paths.root.path()}>
                    <ResponsiveIcon icon={Home} />
                    Go home
                </Anchor>
                <Anchor url={paths.root.auth.login.path()}>
                    <ResponsiveIcon icon={Send} />
                    Resend email
                </Anchor>
            </SubFooter>
        </React.Fragment>
    );
}

export default Page;
