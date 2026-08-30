import { createAsyncThunk } from '@reduxjs/toolkit';
import { dynamicApi } from '../../../../../lib/utils/api/apiClient';
import { FetchAction } from '@/components/types.components';
import { PaginatedResponse } from '@/lib/definitions/api.definitions';
import { DegreeFormData } from '../schema';

export const degreeListQuery = createAsyncThunk(
    'education/degreeListQuery',
    async ({query, page = 0, pageSize = 5} : FetchAction, thunkAPI)  => {
        try {

            const response = await dynamicApi<PaginatedResponse<DegreeFormData>>({
                method: 'GET',
                url: `/Owner/LKP_DegreeList?Search=${query}&PageNumber=${page}&PageSize=${pageSize}`,
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
