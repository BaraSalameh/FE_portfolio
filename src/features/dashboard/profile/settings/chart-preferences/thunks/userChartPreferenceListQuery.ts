import { createAsyncThunk } from '@reduxjs/toolkit';
import { PaginatedResponse } from '@/lib/api/types';
import { UserChartPreferenceResponse } from '../types.chart-preferences';
import { dashboardQuery } from '@/features/dashboard/requests';

export const userChartPreferenceListQuery = createAsyncThunk(
    'userChartPreference/userChartPreferenceListQuery',
    async (_, thunkAPI)  => {
        try {

            const response = await dashboardQuery<PaginatedResponse<UserChartPreferenceResponse>>({
                method: 'GET',
                url: '/Owner/UserChartPreferenceList',
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
