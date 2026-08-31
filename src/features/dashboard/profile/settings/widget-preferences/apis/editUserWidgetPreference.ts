import { transformPayload } from "@/lib/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserWidgetPreferenceFormData } from "../schema";
import { dashboardMutation } from "@/lib/utils";

export const editUserWidgetPreference = createAsyncThunk(
    'userWidgetPreference/editUserPrference',
    async (payload: UserWidgetPreferenceFormData, thunkAPI) => {
        try {
            const request = transformPayload(payload);

            await dashboardMutation({
                method: 'POST',
                url: '/Owner/EditUserPreference',
                data: request,
                withCredentials: true
            });
            
            return;

        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    }
);
import { getApiErrorPayload } from "@/lib/utils";
