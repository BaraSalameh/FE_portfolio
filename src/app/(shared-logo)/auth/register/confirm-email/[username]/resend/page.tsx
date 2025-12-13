import { Loading } from "@/components";
import { resendEmail } from "@/lib/server-actions/auth.actions";

const Page = async (
    props: {
        params: Promise<{
            username: string;
        }>
    }
) => {
    const { username } = await props.params;

    await resendEmail(username);

    return (<Loading isLoading={true} message="Resending email, please wait..." />);
}

export default Page;