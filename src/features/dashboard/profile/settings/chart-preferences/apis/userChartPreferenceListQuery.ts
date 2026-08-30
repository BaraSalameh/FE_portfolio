import { createAsyncThunk } from '@reduxjs/toolkit';
import { PaginatedResponse } from '@/lib/definitions/api.definitions';
import { UserChartPreferenceResponse } from '../types.chart-preferences';
import { dynamicApi } from '../../../../../../lib/utils/api/apiClient';

export const userChartPreferenceListQuery = createAsyncThunk(
    'userChartPreference/userChartPreferenceListQuery',
    async (_, thunkAPI)  => {
        try {

            const response = await dynamicApi<PaginatedResponse<UserChartPreferenceResponse>>({
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
import { getApiErrorPayload } from "@/lib/utils";
