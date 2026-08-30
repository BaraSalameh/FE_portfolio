import { dynamicApi } from "@/lib/utils";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PaginatedResponse } from '@/lib/definitions/api.definitions';
import { UserLanguageResponse } from '../types.language';

export const userLanguageListQuery = createAsyncThunk(
    'userLanguage/userLanguageListQuery',
    async (_, thunkAPI)  => {
        try {

            const response = await dynamicApi<PaginatedResponse<UserLanguageResponse>>({
                method: 'GET',
                url: '/Owner/UserLanguageList',
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
