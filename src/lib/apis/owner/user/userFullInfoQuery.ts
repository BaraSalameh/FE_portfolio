import { createAsyncThunk } from '@reduxjs/toolkit';
import { dynamicApi } from '../../apiClient';

export const userFullInfoQuery = createAsyncThunk(
    'owner/userFullInfoQuery',
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
