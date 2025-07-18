import { createAsyncThunk } from '@reduxjs/toolkit';
import { dynamicApi } from '@/features';

export const validateToken = createAsyncThunk(
    'auth/validateToken',
    async (_, thunkAPI) => {
        try {
            const response = await dynamicApi({
                method: "POST",
                url: '/Account/ValidateToken',
                data: {},
                retryOn401: false
            });
            
            return response.data;
            
        } catch (error: any) {
            if(error.status === 401){
                return thunkAPI.rejectWithValue(error.response.data);
            }
            return thunkAPI.rejectWithValue(['Unexpected error occurred.']);
        }
    }
);
