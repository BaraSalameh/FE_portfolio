import { createAsyncThunk } from "@reduxjs/toolkit";

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, thunkAPI) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Account/Logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({}),
                credentials: "include"
            });

            if (res.status === 204){
                return;
            }

        } catch (error) {
            return thunkAPI.rejectWithValue(['Unexpected error occurred.']);
        }
    }
);