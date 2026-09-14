import 'server-only';

import { notFound, redirect } from 'next/navigation';
import { paths } from '@/lib/pathHelper';
import { ApiError } from './types';

export const handlePageApiError = (error: unknown): never => {
    if (error instanceof ApiError) {
        if (error.status === 401) redirect(paths.root.auth.login.path());
        if (error.status === 404) notFound();
    }

    throw error;
};
