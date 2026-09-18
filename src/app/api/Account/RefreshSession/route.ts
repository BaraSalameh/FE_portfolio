import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import { refreshServerSession } from '@/lib/api/server-client';
import { paths } from '@/lib/pathHelper';

const safeReturnPath = (request: NextRequest) => {
    const requested = request.nextUrl.searchParams.get('returnTo');
    if (!requested || !requested.startsWith('/') || requested.startsWith('//')) {
        return paths.root.path();
    }

    const target = new URL(requested, request.nextUrl.origin);
    return target.origin === request.nextUrl.origin
        ? `${target.pathname}${target.search}${target.hash}`
        : paths.root.path();
};

export async function GET(request: NextRequest) {
    const returnTo = safeReturnPath(request);

    try {
        await refreshServerSession();
    } catch {
        redirect(paths.root.auth.login.path());
    }

    redirect(returnTo);
}
