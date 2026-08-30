import { createAsyncThunk } from "@reduxjs/toolkit";
import { dynamicApi } from "../../../../../lib/utils/api/apiClient";

export const deleteEducation = createAsyncThunk(
    'education/deleteEducation',
    async (id: string, thunkAPI) => {
        try {
            await dynamicApi({
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
import { getApiErrorPayload } from "@/lib/utils";
