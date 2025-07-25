import { createAsyncThunk } from '@reduxjs/toolkit';
import { dynamicApi } from '../../../../../lib/utils/api/apiClient';
import { FetchAction } from '@/components/types.components';

export const degreeListQuery = createAsyncThunk(
    'education/degreeListQuery',
    async ({query, page = 0, pageSize = 5} : FetchAction, thunkAPI)  => {
        try {

            const response = await dynamicApi({
                method: 'GET',
                url: `/Owner/LKP_DegreeList?Search=${query}&PageNumber=${page}&PageSize=${pageSize}`,
                withCredentials: true
            });

            if (response.status === 204) return {items: [], rowCount: 0, page};

            return { ...response.data, page };

        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
