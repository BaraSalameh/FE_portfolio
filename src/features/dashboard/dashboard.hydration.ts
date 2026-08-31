import { createAction } from '@reduxjs/toolkit';
import { DashboardResponse } from './types.dashboard';

export const dashboardHydrated = createAction<DashboardResponse>('dashboard/hydrated');
