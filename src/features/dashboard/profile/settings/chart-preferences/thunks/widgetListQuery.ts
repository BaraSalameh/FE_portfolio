import { createAsyncThunk } from '@reduxjs/toolkit';
import { PaginatedResponse } from '@/lib/api/types';
import { WidgetFormData } from '../schema';
import { dashboardQuery } from '@/features/dashboard/requests';

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
    }
);
import { getApiErrorPayload } from "@/lib/api/errors";
