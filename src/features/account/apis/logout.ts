import { createAsyncThunk } from "@reduxjs/toolkit";
import { dynamicApi } from "@/lib/utils";

export const logout = createAsyncThunk(
    'auth/logout',
    async (_, thunkAPI) => {
        try {
            const response = await dynamicApi({
                method: "POST",
                url: '/Account/Logout',
                data: {}
            });

            if (response.status === 204) return;

        } catch (error) {
            return thunkAPI.rejectWithValue(['Unexpected error occurred.']);
        }
    }
);