import { dashboardMutation } from "@/features/dashboard/requests";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const deleteExperience = createAsyncThunk(
    'experience/deleteExperience',
    async (id: string, thunkAPI) => {
        try {
            await dashboardMutation({
                method: 'DELETE',
                url: '/Owner/DeleteExperience',
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
