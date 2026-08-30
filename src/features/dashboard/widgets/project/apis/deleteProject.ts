import { dynamicApi } from "@/lib/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const deleteProject = createAsyncThunk(
    'project/deleteProject',
    async (id: string, thunkAPI) => {
        try {
            await dynamicApi({
                method: 'DELETE',
                url: '/Owner/DeleteProject',
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
