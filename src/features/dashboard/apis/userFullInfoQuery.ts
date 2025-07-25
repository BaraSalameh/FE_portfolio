import { dynamicApi } from "@/lib/utils";
import { createAsyncThunk } from '@reduxjs/toolkit';

export const userFullInfoQuery = createAsyncThunk(
    'profile/userFullInfoQuery',
    async (_, thunkAPI)  => {
        try {
            const response = await dynamicApi({
                method: 'GET',
                url: '/Owner/UserFullInfo',
                withCredentials: true
            });

            return response.data;

        } catch (error: any) {
            if(error.status === 400) {
                return thunkAPI.rejectWithValue(error.response.data);
            }
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
