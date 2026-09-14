import { dashboardMutation } from '@/features/dashboard/requests';
import { getApiErrorPayload } from '@/lib/api/errors';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const sortProject = createAsyncThunk(
    'project/sortProject',
    async (projectIds: string[], thunkAPI) => {
        try {
            await dashboardMutation({
                method: 'POST',
                url: '/Owner/SortProject',
                data: { ProjectIdsInOrder: projectIds },
                withCredentials: true,
            });
            return projectIds;
        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    },
);
