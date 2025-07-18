import { dynamicApi } from "@/features";
import { createAsyncThunk } from '@reduxjs/toolkit';

export const languageProficiencyListQuery = createAsyncThunk(
    'userLanguage/languageProficiencyListQuery',
    async (_, thunkAPI)  => {
        try {

            const response = await dynamicApi({
                method: 'GET',
                url: '/Owner/LKP_LanguageProficiencyList',
                withCredentials: true
            });

            if (response.status === 204) return [];

            return [...response.data.items];

        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
