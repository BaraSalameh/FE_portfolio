import { dynamicApi } from "@/lib/utils";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PaginatedResponse } from '@/lib/definitions/api.definitions';
import { UserSkillResponse } from '../types.skill';

export const userSkillListQuery = createAsyncThunk(
    'userSkill/userSkillListQuery',
    async (_, thunkAPI)  => {
        try {

            const response = await dynamicApi<PaginatedResponse<UserSkillResponse>>({
                method: 'GET',
                url: '/Owner/UserSkillList',
                withCredentials: true
            });

            if (response.status === 204) return [];

            return [...response.data.items];

        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    }
);
import { getApiErrorPayload } from "@/lib/utils";
