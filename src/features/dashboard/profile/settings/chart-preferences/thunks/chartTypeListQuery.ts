import { createAsyncThunk } from '@reduxjs/toolkit';
import { PaginatedResponse } from '@/lib/api/types';
import { ChartTypeFormData } from '../schema';
import { dashboardQuery } from '@/features/dashboard/requests';
import { getApiErrorPayload } from '@/lib/api/errors';
import type { RootState } from '@/lib/store/store';

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
    },
    {
        condition: (_, { getState }) => {
            const { loading, lstChartTypes } = (getState() as RootState).userChartPreference.chartType;
            return !loading && lstChartTypes.length === 0;
        },
    },
);
