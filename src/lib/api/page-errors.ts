import 'server-only';

import { notFound, redirect } from 'next/navigation';
import { ApiError } from './types';

export const handlePageApiError = (error: unknown, returnTo: string): never => {
    if (error instanceof ApiError) {
        if (error.status === 401) {
            redirect(`/api/Account/RefreshSession?returnTo=${encodeURIComponent(returnTo)}`);
        }
        if (error.status === 404) notFound();
    }

    throw error;
};
