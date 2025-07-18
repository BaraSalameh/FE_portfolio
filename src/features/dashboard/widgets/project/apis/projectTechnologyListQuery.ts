import { dynamicApi } from "@/features";
import { createAsyncThunk } from '@reduxjs/toolkit';

export const projectTechnologyListQuery = createAsyncThunk(
    'projectTechnology/projectTechnologyListQuery',
    async (_, thunkAPI)  => {
        try {

            const response = await dynamicApi({
                method: 'GET',
                url: '/Owner/ProjectTechnologyList',
                withCredentials: true
            });

            if (response.status === 204) return [];

            return [...response.data.items];

        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
