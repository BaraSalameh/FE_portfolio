import { createAsyncThunk } from '@reduxjs/toolkit';
import { FetchAction } from '@/features/dashboard/types.presentation';
import { dynamicApi } from "@/lib/utils";
import { PaginatedResponse } from '@/lib/definitions/api.definitions';
import { SkillFormData } from '../schema';

export const skillListQuery = createAsyncThunk(
    'userSkill/skillListQuery',
    async ({query, page = 0, pageSize = 5} : FetchAction, thunkAPI)  => {
        try {

            const response = await dynamicApi<PaginatedResponse<SkillFormData>>({
                method: 'GET',
                url: `/Owner/LKP_SkillList?Search=${query}&PageNumber=${page}&PageSize=${pageSize}`,
                withCredentials: true
            });

            if (response.status === 204) return {items: [], rowCount: 0, page};

            return { ...response.data, page };

        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    }
);
import { getApiErrorPayload } from "@/lib/utils";
