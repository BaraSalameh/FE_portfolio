import { createAsyncThunk } from '@reduxjs/toolkit';
import { PaginatedResponse } from '@/lib/api/types';
import { ChartTypeFormData } from '../schema';
import { dashboardQuery } from '@/features/dashboard/requests';

export const chartTypeListQuery = createAsyncThunk(
    'userChartPreference/chartTypeListQuery',
    async (_, thunkAPI)  => {
        try {

            const response = await dashboardQuery<PaginatedResponse<ChartTypeFormData>>({
                method: 'GET',
                url: '/Owner/LKP_ChartTypeList',
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
