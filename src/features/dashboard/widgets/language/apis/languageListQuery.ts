import { createAsyncThunk } from '@reduxjs/toolkit';
import { FetchAction } from '@/components/types.components';
import { dynamicApi } from "@/lib/utils";

export const languageListQuery = createAsyncThunk(
    'userLanguage/languageListQuery',
    async ({query, page = 0, pageSize = 5} : FetchAction, thunkAPI)  => {
        try {

            const response = await dynamicApi({
                method: 'GET',
                url: `/Owner/LKP_LanguageList?Search=${query}&PageNumber=${page}&PageSize=${pageSize}`,
                withCredentials: true
            });

            if (response.status === 204) return {items: [], rowCount: 0, page};

            return { ...response.data, page };

        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
