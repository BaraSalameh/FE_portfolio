import { AuthFrame, LoginForm } from '@/features/auth';
import { paths } from "@/lib/pathHelper";
import { safeAppPath } from '@/lib/api/auth-navigation';

const LoginPage = async ({
    searchParams,
}: PageProps<'/auth/login'>) => {
    const query = await searchParams;
    const returnTo = safeAppPath(
        typeof query.returnTo === 'string' ? query.returnTo : undefined,
    );

    return (
        <AuthFrame alternateHref={paths.root.auth.register.path()} alternateLabel="Create an account" prompt="New here?">
            <LoginForm returnTo={returnTo ?? undefined} />
        </AuthFrame>
    );
}

export default LoginPage;
