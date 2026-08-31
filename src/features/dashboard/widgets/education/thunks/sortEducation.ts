import { createAsyncThunk } from "@reduxjs/toolkit";
import { dashboardMutation } from "@/features/dashboard/requests";

export const sortEducation = createAsyncThunk(
    'education/sortEducation',
    async (payload: string[], thunkAPI) => {
        try {
            await dashboardMutation({
                method: 'POST',
                url: '/Owner/ReOrderEducation',
                data: {educationIdsInOrder: payload},
                withCredentials: true
            });

            return;

        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    }
);
import { getApiErrorPayload } from "@/lib/api/errors";
