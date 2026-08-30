import { dynamicApi } from "@/lib/utils";
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

        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    }
);
import { getApiErrorPayload } from "@/lib/utils";
