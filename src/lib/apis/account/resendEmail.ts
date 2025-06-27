import { createAsyncThunk } from "@reduxjs/toolkit";

export const resendEmail = createAsyncThunk(
    'auth/resendEmail',
    async (payload: { email: string }, thunkAPI) => {
        try {
            const query = new URLSearchParams({
                email: payload.email
            }).toString();
    
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Account/ResendConfirmEmail?${query}`, {
                method: 'GET',
            });

            if (res.status === 204) return;
        
            if (!res.ok){
                const error = await res.json();
                return thunkAPI.rejectWithValue(error)
            }

        } catch (error) {
            return thunkAPI.rejectWithValue(['Unexpected error occurred']);
        }
    }
);
  