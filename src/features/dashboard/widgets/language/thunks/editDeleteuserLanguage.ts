import { dashboardMutation } from "@/features/dashboard/requests";
import { transformPayload } from "@/lib/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserLanguageFormData } from "../schema";
import { UserLanguageResponse } from "../types.language";

export const editDeleteUserLanguage = createAsyncThunk(
    'userLanguage/editDeleteUserLanguage',
    async (payload: UserLanguageFormData, thunkAPI) => {
        try {
            const request = transformPayload(payload);

            const response = await dashboardMutation<UserLanguageResponse[]>({
                method: 'POST',
                url: '/Owner/EditDeleteUserLanguage',
                data: request,
                withCredentials: true
            });

            if (!response.data) {
                return thunkAPI.rejectWithValue('Language API returned no updated collection. Restart or update the backend.');
            }

            return response.data;

        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    }
);
import { getApiErrorPayload } from "@/lib/api/errors";
