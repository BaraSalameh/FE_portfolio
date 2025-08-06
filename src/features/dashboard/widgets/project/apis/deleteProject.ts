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

        } catch (error: any) {
            if (error.response.status === 400) {
                return thunkAPI.rejectWithValue(error.response.data);
            }
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);