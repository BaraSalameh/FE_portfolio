import { dynamicApi, getApiErrorPayload } from '@/lib/utils';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { DashboardResponse } from '../types.dashboard';

export const userByUsernameQuery = createAsyncThunk(
    'profile/userByUsernameQuery',
    async (username: string, thunkAPI) => {
        try {
            const response = await dynamicApi<DashboardResponse>({
                method: "GET",
                url: `/Client/UserByUsername?Username=${username}`
            });
    
            if (response.status === 204) return thunkAPI.rejectWithValue('Portfolio not found');
    
            return response.data;
            
        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    }
);
