import { transformPayload } from "@/lib/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ProjectFormData } from "../schema";
import { dynamicApi } from "@/lib/utils";

export const addEditProject = createAsyncThunk(
    'project/addEditProject',
    async (payload: ProjectFormData, thunkAPI) => {
        try {
            const request = transformPayload(payload);

            await dynamicApi({
                method: 'POST',
                url: '/Owner/AddEditProject',
                data: request,
                withCredentials: true
            });

            return;

        } catch (error: any) {
            if (error.response.status === 400) {
                return thunkAPI.rejectWithValue(error.response.data);
            }
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);