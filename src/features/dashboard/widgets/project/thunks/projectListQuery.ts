import { dashboardQuery } from "@/features/dashboard/requests";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PaginatedResponse } from '@/lib/api/types';
import { ProjectResponse } from '../types.project';

export const projectListQuery = createAsyncThunk(
    'project/projectListQuery',
    async (_, thunkAPI)  => {
        try {

            const response = await dashboardQuery<PaginatedResponse<ProjectResponse>>({
                method: 'GET',
                url: '/Owner/ProjectList',
                withCredentials: true
            });

            if (response.status === 204) return [];

            return [...response.data.items];

        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    }
);
import { getApiErrorPayload } from "@/lib/api/errors";
