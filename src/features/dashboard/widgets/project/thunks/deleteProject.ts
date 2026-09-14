import { dashboardMutation } from '@/features/dashboard/requests';
import { getApiErrorPayload } from '@/lib/api/errors';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const deleteProject = createAsyncThunk(
    'project/deleteProject',
    async (id: string, thunkAPI) => {
        try {
            await dashboardMutation({
                method: 'DELETE',
                url: '/Owner/DeleteProject',
                data: { id },
                withCredentials: true,
            });
            return id;
        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    },
);
