import { dynamicApi } from "@/lib/utils";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PaginatedResponse } from '@/lib/definitions/api.definitions';
import { WidgetPreferenceFormData } from '../schema';

export const widgetPreferenceListQuery = createAsyncThunk(
    'userWidgetPreference/widgetPreferenceListQuery',
    async (_, thunkAPI)  => {
        try {

            const response = await dynamicApi<PaginatedResponse<WidgetPreferenceFormData>>({
                method: 'GET',
                url: '/Owner/LKP_PreferenceList',
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
