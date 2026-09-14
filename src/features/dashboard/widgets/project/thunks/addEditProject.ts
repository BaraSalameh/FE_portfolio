import { dashboardMutation } from '@/features/dashboard/requests';
import { getApiErrorPayload } from '@/lib/api/errors';
import { transformPayload } from '@/lib/utils';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ProjectFormData } from '../schema';
import { ProjectResponse } from '../types.project';

export const addEditProject = createAsyncThunk(
    'project/addEditProject',
    async (payload: ProjectFormData, thunkAPI) => {
        try {
            const response = await dashboardMutation<ProjectResponse>({
                method: 'POST',
                url: '/Owner/AddEditProject',
                data: transformPayload(payload),
                withCredentials: true,
            });

            if (!response.data) {
                return thunkAPI.rejectWithValue('Project API returned no saved record. Restart or update the backend.');
            }

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    },
);
