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

        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    }
);
import { getApiErrorPayload } from "@/lib/utils";
