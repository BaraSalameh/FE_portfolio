import { createAsyncThunk } from '@reduxjs/toolkit';
import { FetchAction } from '@/components/types.components';
import { dynamicApi } from "@/lib/utils";
import { PaginatedResponse } from '@/lib/definitions/api.definitions';
import { InstitutionFormData } from '../schema';

export const institutionListQuery = createAsyncThunk(
    'education/institutionListQuery',
    async ({query, page = 0, pageSize = 5} : FetchAction, thunkAPI)  => {
        try {

            const response = await dynamicApi<PaginatedResponse<InstitutionFormData>>({
                method: 'GET',
                url: `/Owner/LKP_InstitutionList?Search=${query}&PageNumber=${page}&PageSize=${pageSize}`,
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
