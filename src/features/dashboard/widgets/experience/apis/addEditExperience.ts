import { transformPayload } from "@/lib/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ExperienceFormData } from "../schema";
import { dynamicApi } from "@/lib/utils";

export const addEditExperience = createAsyncThunk(
    'experience/addEditExperience',
    async (payload: ExperienceFormData, thunkAPI) => {
        try {
            const request = transformPayload(payload);

            await dynamicApi({
                method: 'POST',
                url: '/Owner/AddEditExperience',
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
