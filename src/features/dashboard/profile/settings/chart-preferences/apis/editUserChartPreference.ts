import { transformPayload } from "@/lib/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { dynamicApi } from "@/features";
import { UserChartPreferenceFormData } from "../schema";

export const editUserChartPreference = createAsyncThunk(
    'userChartPreference/editUserChartPreference',
    async (payload: UserChartPreferenceFormData, thunkAPI) => {
        try {
            const request = transformPayload(payload);

            await dynamicApi({
                method: 'POST',
                url: '/Owner/EditUserChartPreference',
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