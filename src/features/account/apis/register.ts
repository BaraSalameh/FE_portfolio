import { createAsyncThunk } from "@reduxjs/toolkit";
import { dynamicApi } from "@/lib/utils";

export const register = createAsyncThunk(
    'auth/register',
    async (payload: { firstname: string, lastname: string, email: string; password: string, rememberMe: boolean }, thunkAPI) => {
        try {
            const response = await dynamicApi({
                method: "POST",
                url: '/Account/Register',
                data: payload,
            });

            return {...response.data, isConfirmed: false};

        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data ??['Unexpected error occurred.']);
        }
    }
);