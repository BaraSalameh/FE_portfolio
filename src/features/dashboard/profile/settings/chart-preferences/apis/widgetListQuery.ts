import { createAsyncThunk } from '@reduxjs/toolkit';
import { PaginatedResponse } from '@/lib/definitions/api.definitions';
import { WidgetFormData } from '../schema';
import { dynamicApi } from '../../../../../../lib/utils/api/apiClient';

export const widgetListQuery = createAsyncThunk(
    'userChartPreference/widgetListQuery',
    async (_, thunkAPI)  => {
        try {

            const response = await dynamicApi<PaginatedResponse<WidgetFormData>>({
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
import { getApiErrorPayload } from "@/lib/utils";
