import { createAsyncThunk } from "@reduxjs/toolkit";
import { ContactMessageFormData } from "../schema";
import { dashboardMutation } from "@/features/dashboard/requests";

export const sendEmail = createAsyncThunk(
    'client/sendEmail',
    async (payload: ContactMessageFormData, thunkAPI) => {
        try {
            await dashboardMutation({
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
import { getApiErrorPayload } from "@/lib/api/errors";
