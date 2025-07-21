import { createAsyncThunk } from "@reduxjs/toolkit";
import { dynamicApi } from "@/lib/utils";

export const login = createAsyncThunk(
    'auth/login',
    async (payload: { email: string; password: string, rememberMe: boolean }, thunkAPI) => {
        try {
            const response = await dynamicApi({
                method: "POST",
                url: '/Account/Login',
                data: payload,
            });

            return response.data;

        } catch (error: any) {
            if(error.status === 404) {
                return thunkAPI.rejectWithValue(error.response.data);
            }
            if (error.status === 403) {
                return thunkAPI.rejectWithValue({error: error.response.data, isConfirmed: false});
            }
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);