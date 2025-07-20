import { dynamicApi } from "@/features";
import { transformPayload } from "@/lib/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserLanguageFormData } from "../schema";

export const editDeleteUserLanguage = createAsyncThunk(
    'userLanguage/editDeleteUserLanguage',
    async (payload: UserLanguageFormData, thunkAPI) => {
        try {
            const request = transformPayload(payload);

            await dynamicApi({
                method: 'POST',
                url: '/Owner/EditDeleteUserLanguage',
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