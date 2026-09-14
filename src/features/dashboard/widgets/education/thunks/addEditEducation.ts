
import { transformPayload } from "@/lib/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { EducationFormData } from "../schema";
import { dashboardMutation } from "@/features/dashboard/requests";
import { EducationResponse } from "../types.education";

export const addEditEducation = createAsyncThunk(
    'education/addEditEducation',
    async (payload: EducationFormData, thunkAPI) => {
        try {
            const request = transformPayload(payload);

            const response = await dashboardMutation<EducationResponse>({
                method: 'POST',
                url: '/Owner/AddEditEducation',
                data: request,
                withCredentials: true
            });

            if (!response.data) {
                return thunkAPI.rejectWithValue('Education API returned no saved record. Restart or update the backend.');
            }

            return response.data;

        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    }
);
import { getApiErrorPayload } from "@/lib/api/errors";
