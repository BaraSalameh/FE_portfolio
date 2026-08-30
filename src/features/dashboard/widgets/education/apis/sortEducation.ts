import { createAsyncThunk } from "@reduxjs/toolkit";
import { dynamicApi } from "../../../../../lib/utils/api/apiClient";

export const sortEducation = createAsyncThunk(
    'education/sortEducation',
    async (payload: string[], thunkAPI) => {
        try {
            await dynamicApi({
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
import { getApiErrorPayload } from "@/lib/utils";
