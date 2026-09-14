import { transformPayload } from "@/lib/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ExperienceFormData } from "../schema";
import { dashboardMutation } from "@/features/dashboard/requests";
import { ExperienceResponse } from "../types.experience";

export const addEditExperience = createAsyncThunk(
    'experience/addEditExperience',
    async (payload: ExperienceFormData, thunkAPI) => {
        try {
            const request = transformPayload(payload);

            const response = await dashboardMutation<ExperienceResponse>({
                method: 'POST',
                url: '/Owner/AddEditExperience',
                data: request,
                withCredentials: true
            });

            if (!response.data) {
                return thunkAPI.rejectWithValue('Experience API returned no saved record. Restart or update the backend.');
            }

            return response.data;

        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    }
);
import { getApiErrorPayload } from "@/lib/api/errors";
