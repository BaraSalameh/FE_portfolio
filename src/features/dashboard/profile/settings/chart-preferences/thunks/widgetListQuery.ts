import { createAsyncThunk } from '@reduxjs/toolkit';
import { PaginatedResponse } from '@/lib/api/types';
import { WidgetFormData } from '../schema';
import { dashboardQuery } from '@/features/dashboard/requests';
import { getApiErrorPayload } from '@/lib/api/errors';
import type { RootState } from '@/lib/store/store';

export const widgetListQuery = createAsyncThunk(
    'userChartPreference/widgetListQuery',
    async (_, thunkAPI)  => {
        try {

            const response = await dashboardQuery<PaginatedResponse<WidgetFormData>>({
                method: 'GET',
                url: '/Owner/LKP_WidgetList',
                withCredentials: true
            });

            if (response.status === 204) return [];

            return [...response.data.items];

        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    },
    {
        condition: (_, { getState }) => {
            const { loading, lstWidgets } = (getState() as RootState).userChartPreference.widget;
            return !loading && lstWidgets.length === 0;
        },
    },
);
