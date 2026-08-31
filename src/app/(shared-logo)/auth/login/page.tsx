import { AuthFrame, LoginForm } from '@/features/auth';
import { paths } from "@/lib/pathHelper";

const LoginPage = async () => {
    return (
        <AuthFrame alternateHref={paths.root.auth.register.path()} alternateLabel="Create an account" prompt="New here?">
            <LoginForm />
        </AuthFrame>
    );
}

export default LoginPage;
