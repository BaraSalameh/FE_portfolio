import { createAsyncThunk } from '@reduxjs/toolkit';
import { PaginatedResponse } from '@/lib/definitions/api.definitions';
import { ChartTypeFormData } from '../schema';
import { dynamicApi } from '../../../../../../lib/utils/api/apiClient';

export const chartTypeListQuery = createAsyncThunk(
    'userChartPreference/chartTypeListQuery',
    async (_, thunkAPI)  => {
        try {

            const response = await dynamicApi<PaginatedResponse<ChartTypeFormData>>({
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
import { getApiErrorPayload } from "@/lib/utils";
