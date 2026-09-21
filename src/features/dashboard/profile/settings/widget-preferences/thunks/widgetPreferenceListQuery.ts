import { dashboardQuery } from "@/features/dashboard/requests";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PaginatedResponse } from '@/lib/api/types';
import { getApiErrorPayload } from '@/lib/api/errors';
import type { RootState } from '@/lib/store/store';
import { WidgetPreferenceFormData } from '../schema';

export const widgetPreferenceListQuery = createAsyncThunk(
    'userWidgetPreference/widgetPreferenceListQuery',
    async (_, thunkAPI)  => {
        try {
            const response = await dashboardQuery<PaginatedResponse<WidgetPreferenceFormData>>({
                method: 'GET',
                url: '/Owner/LKP_PreferenceList?PageNumber=0&PageSize=100',
                withCredentials: true,
            });

            if (response.status === 204) return [];
            return response.data.items;

        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    },
    {
        condition: (_, { getState }) => {
            const { loading, lstPreferences } = (getState() as RootState).userWidgetPreference.preference;
            return !loading && lstPreferences.length === 0;
        },
    },
);
