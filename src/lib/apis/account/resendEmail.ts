import { createAsyncThunk } from "@reduxjs/toolkit";
import { dynamicApi } from "../apiClient";

export const resendEmail = createAsyncThunk(
    'auth/resendEmail',
    async (payload: { email: string }, thunkAPI) => {
        try {
            const query = new URLSearchParams({
                email: payload.email
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
  