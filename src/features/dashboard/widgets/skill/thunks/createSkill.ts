import { createAsyncThunk } from '@reduxjs/toolkit';
import { browserApi } from '@/lib/api/browser-client';
import { getApiErrorPayload } from '@/lib/api/errors';
import { SkillFormData } from '../schema';

export const createSkill = createAsyncThunk(
    'userSkill/createSkill',
    async (name: string, thunkAPI) => {
        try {
            const response = await browserApi<SkillFormData>({
                method: 'POST',
                url: '/Owner/AddLKP_Skill',
                data: { name },
                sendCredentials: true,
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    },
);
