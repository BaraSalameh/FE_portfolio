import { createAsyncThunk } from "@reduxjs/toolkit";
import { ContactMessageFormData } from "../schema";
import { dynamicApi } from "@/lib/utils/api/apiClient";

export const sendEmail = createAsyncThunk(
    'client/sendEmail',
    async (payload: ContactMessageFormData, thunkAPI) => {
        try {
            await dynamicApi({
                method: "POST",
                url: '/Client/SendEmail',
                data: payload
            });
    
            return;

        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    }
);
import { getApiErrorPayload } from "@/lib/utils";
