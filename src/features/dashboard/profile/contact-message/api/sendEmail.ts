import { createAsyncThunk } from "@reduxjs/toolkit";
import { ContactMessageFormData } from "../schema";
import { dynamicApi } from "@/lib/utils/api/apiClient";

export const sendEmail = createAsyncThunk(
    'client/sendEmail',
    async (payload: ContactMessageFormData, thunkAPI) => {
        try {
            await dynamicApi({
                method: "POST",
                url: `Client/sendEmail`,
                data: payload
            });
    
            return;

        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data ?? ['Unexpected error occurred.']);
        }
    }
);