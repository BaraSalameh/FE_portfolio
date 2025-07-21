import { dynamicApi } from "@/lib/utils";
import { createAsyncThunk } from '@reduxjs/toolkit';

export const educationListQuery = createAsyncThunk(
    'education/educationListQuery',
    async (_, thunkAPI)  => {
        try {

            const response = await dynamicApi({
                method: 'GET',
                url: '/Owner/EducationList',
                withCredentials: true
            });

            if (response.status === 204) return [];

            return [...response.data.items];

        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
