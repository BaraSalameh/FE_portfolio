import { dynamicApi } from "@/lib/utils";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { DashboardResponse } from '../types.dashboard';

export const userFullInfoQuery = createAsyncThunk(
    'profile/userFullInfoQuery',
    async (_, thunkAPI)  => {
        try {
            const response = await dynamicApi<DashboardResponse>({
                method: 'GET',
                url: '/Owner/UserFullInfo',
                withCredentials: true
            });

            return response.data;

        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    }
);
import { getApiErrorPayload } from "@/lib/utils";
