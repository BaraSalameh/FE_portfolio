import { createAsyncThunk } from '@reduxjs/toolkit';
import { dynamicApi } from '../apiClient';

export const userByUsernameQuery = createAsyncThunk(
    'client/userByUsernameQuery',
    async (username: string, thunkAPI) => {
        try {
            const response = await dynamicApi({
                method: "GET",
                url: `Client/UserByUsername?Username=${username}`
            });
    
            if (response.status === 204) return [];
    
            return response.data;
            
        } catch {
            return thunkAPI.rejectWithValue(['Unexpected error occurred']);
        }
    }
);
