import { createAsyncThunk } from "@reduxjs/toolkit";
import { dynamicApi } from "../apiClient";

export const login = createAsyncThunk(
    'auth/login',
    async (payload: { email: string; password: string, rememberMe: boolean }, thunkAPI) => {
        try {
            const response = await dynamicApi({
                method: "POST",
                url: '/Account/Login',
                sendCredentials: false,
                data: payload
            })

            if (response.status === 404) {
                return thunkAPI.rejectWithValue(response);
            }

            if (response.status === 403) {
                return thunkAPI.rejectWithValue({error: response, isConfirmed: false});
            }

            return response;

        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);