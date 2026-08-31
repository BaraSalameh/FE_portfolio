'use client';

import { useState } from 'react';
import { Provider } from 'react-redux';
import { dashboardHydrated } from '@/features/dashboard/dashboard.hydration';
import { DashboardResponse } from '@/features/dashboard/types.dashboard';
import { makeStore } from '@/lib/store/store';

interface DashboardStoreProviderProps {
    children: React.ReactNode;
    dashboard: DashboardResponse;
}

export default function DashboardStoreProvider({ children, dashboard }: DashboardStoreProviderProps) {
    const [store] = useState(() => {
        const store = makeStore();
        store.dispatch(dashboardHydrated(dashboard));
        return store;
    });

    return <Provider store={store}>{children}</Provider>;
}
