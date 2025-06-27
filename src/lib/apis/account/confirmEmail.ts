import { createAsyncThunk } from "@reduxjs/toolkit";
import { dynamicApi } from "../apiClient";

export const confirmEmail = createAsyncThunk(
    'auth/confirmEmail',
    async (payload: { email: string; token: string }, thunkAPI) => {
        try {
            const query = new URLSearchParams({
                email: payload.email,
                token: payload.token
            }).toString();

            const response = await dynamicApi({
                method: 'GET',
                url: `/Account/ConfirmEmail?${query}`
            });

            if (response.status === 204) return {isConfirmed: true};

        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data ?? ['Unexpected error occurred.']);
        }
    }
);
  