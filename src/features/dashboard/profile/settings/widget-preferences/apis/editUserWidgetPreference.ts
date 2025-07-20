import { transformPayload } from "@/lib/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserWidgetPreferenceFormData } from "../schema";
import { dynamicApi } from "@/features";

export const editUserWidgetPreference = createAsyncThunk(
    'userWidgetPreference/editUserPrference',
    async (payload: UserWidgetPreferenceFormData, thunkAPI) => {
        try {
            const request = transformPayload(payload);

            await dynamicApi({
                method: 'POST',
                url: '/Owner/EditUserPreference',
                data: request,
                withCredentials: true
            });
            
            return;

        } catch (error: any) {
            if (error.response.status === 400) {
                return thunkAPI.rejectWithValue(error.response.data);
            }
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);