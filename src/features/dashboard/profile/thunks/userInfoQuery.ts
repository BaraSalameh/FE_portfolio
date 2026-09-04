import { dashboardQuery } from "@/features/dashboard/requests";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ProfileFormData } from '../schema';

export const userInfoQuery = createAsyncThunk(
    'owner/userInfoQuery',
    async (_, thunkAPI)  => {
        try {
            const response = await dashboardQuery<ProfileFormData>({
                method: 'GET',
                url: '/Owner/UserInfo',
                withCredentials: true
            });

            if (response.status === 400) {
                return thunkAPI.rejectWithValue(response.data);
            }

            return response.data;

        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    }
);
import { getApiErrorPayload } from "@/lib/api/errors";
