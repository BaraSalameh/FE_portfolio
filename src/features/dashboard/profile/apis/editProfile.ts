import { transformPayload } from "@/lib/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { dashboardMutation } from "@/lib/utils";
import { ProfileFormData } from "../schema";

export const editProfile = createAsyncThunk(
    'owner/editProfile',
    async (payload: ProfileFormData, thunkAPI) => {
        try {
            const request = transformPayload(payload);

            await dashboardMutation({
                method: 'POST',
                url: '/Owner/EditProfile',
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
