import { dashboardMutation } from "@/features/dashboard/requests";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const deleteMessage = createAsyncThunk(
    'contactMessage/deleteMessage',
    async (id: string, thunkAPI) => {
        try {
            await dashboardMutation({
                method: 'DELETE',
                url: '/Owner/DeleteMessage',
                data: {id},
                withCredentials: true
            });

            return;

        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    }
);
import { getApiErrorPayload } from "@/lib/api/errors";
