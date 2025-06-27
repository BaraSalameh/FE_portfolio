import { createAsyncThunk } from '@reduxjs/toolkit';

export const userByUsernameQuery = createAsyncThunk(
    'client/userByUsernameQuery',
    async (username: string, thunkAPI) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Client/UserByUsername?Username=${username}`);

            if(response.status === 204) return [];

            const data = await response.json();
            return data;
            
        } catch {
            return thunkAPI.rejectWithValue(['Unexpected error occurred']);
        }
    }
);
