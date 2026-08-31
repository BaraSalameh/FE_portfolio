import { dashboardMutation } from "@/lib/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const signMessage = createAsyncThunk(
    'contactMessage/signMessage',
    async (id: string, thunkAPI) => {
        try {
            await dashboardMutation({
                method: 'POST',
                url: '/Owner/SignMessage',
                data: {id},
                withCredentials: true
            });

            return;

        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    }
);
import { getApiErrorPayload } from "@/lib/utils";
