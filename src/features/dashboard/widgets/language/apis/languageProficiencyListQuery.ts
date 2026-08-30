import { dynamicApi } from "@/lib/utils";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PaginatedResponse } from '@/lib/definitions/api.definitions';
import { LanguageProficiencyFormData } from '../schema';

export const languageProficiencyListQuery = createAsyncThunk(
    'userLanguage/languageProficiencyListQuery',
    async (_, thunkAPI)  => {
        try {

            const response = await dynamicApi<PaginatedResponse<LanguageProficiencyFormData>>({
                method: 'GET',
                url: '/Owner/LKP_LanguageProficiencyList',
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
