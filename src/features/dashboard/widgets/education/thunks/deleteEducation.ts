import { createAsyncThunk } from "@reduxjs/toolkit";
import { dashboardMutation } from "@/features/dashboard/requests";

export const deleteEducation = createAsyncThunk(
    'education/deleteEducation',
    async (id: string, thunkAPI) => {
        try {
            await dashboardMutation({
                method: 'DELETE',
                url: '/Owner/DeleteEducation',
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
