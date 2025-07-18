import { dynamicApi } from "@/features";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const deleteMessage = createAsyncThunk(
    'contactMessage/deleteMessage',
    async (id: string, thunkAPI) => {
        try {
            await dynamicApi({
                method: 'DELETE',
                url: '/Owner/DeleteMessage',
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