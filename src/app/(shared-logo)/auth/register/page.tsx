import { AuthFrame, RegisterForm } from '@/features/auth';
import { paths } from "@/lib/pathHelper";

const Page = () => {
    return (
        <AuthFrame alternateHref={paths.root.auth.login.path()} alternateLabel="Sign in instead" prompt="Already have an account?">
            <RegisterForm />
        </AuthFrame>
    );
}

export default Page;
