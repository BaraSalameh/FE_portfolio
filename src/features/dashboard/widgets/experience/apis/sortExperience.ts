import { dashboardMutation } from "@/lib/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const sortExperience = createAsyncThunk(
    'experience/sortExperience',
    async (payload: string[], thunkAPI) => {
        try {
            await dashboardMutation({
                method: 'POST',
                url: '/Owner/SortExperience',
                data: {experienceIdsInOrder: payload},
                withCredentials: true
            });

            return;

        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    }
);
import { getApiErrorPayload } from "@/lib/utils";
