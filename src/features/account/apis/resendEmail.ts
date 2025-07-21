import { createAsyncThunk } from "@reduxjs/toolkit";
import { dynamicApi } from "@/lib/utils";

export const resendEmail = createAsyncThunk(
    'auth/resendEmail',
    async (payload: { username: string }, thunkAPI) => {
        try {
            const query = new URLSearchParams({
                username: payload.username
            }).toString();

            const response = await dynamicApi({
                method: "GET",
                url: `/Account/ResendConfirmEmail?${query}`
            });

            if (response.status === 204) return;

        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data ?? ['Unexpected error occurred']);
        }
    }
);
  