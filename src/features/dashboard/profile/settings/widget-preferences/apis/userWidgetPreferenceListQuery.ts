import { dynamicApi } from "@/lib/utils";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PaginatedResponse } from '@/lib/definitions/api.definitions';
import { UserWidgetPreferenceResponse } from '../types.widget-preferences';

export const userWidgetPreferenceListQuery = createAsyncThunk(
    'userWidgetPreference/userWidgetPreferenceListQuery',
    async (_, thunkAPI)  => {
        try {

            const response = await dynamicApi<PaginatedResponse<UserWidgetPreferenceResponse>>({
                method: 'GET',
                url: '/Owner/UserPreferenceList',
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
