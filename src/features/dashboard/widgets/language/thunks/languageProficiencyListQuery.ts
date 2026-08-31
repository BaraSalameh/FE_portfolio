import { dashboardQuery } from "@/features/dashboard/requests";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PaginatedResponse } from '@/lib/api/types';
import { LanguageProficiencyFormData } from '../schema';

export const languageProficiencyListQuery = createAsyncThunk(
    'userLanguage/languageProficiencyListQuery',
    async (_, thunkAPI)  => {
        try {

            const response = await dashboardQuery<PaginatedResponse<LanguageProficiencyFormData>>({
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
import { getApiErrorPayload } from "@/lib/api/errors";
