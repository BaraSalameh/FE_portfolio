import { createAsyncThunk } from '@reduxjs/toolkit';
import { browserApi } from '@/lib/api/browser-client';
import { getApiErrorPayload } from '@/lib/api/errors';
import { FieldOfStudyFormData } from '../schema';

export const createFieldOfStudy = createAsyncThunk(
    'education/createFieldOfStudy',
    async (name: string, thunkAPI) => {
        try {
            const response = await browserApi<FieldOfStudyFormData>({
                method: 'POST',
                url: '/Owner/CreateFieldOfStudy',
                data: { name },
                sendCredentials: true,
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    },
);
