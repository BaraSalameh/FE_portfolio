import { createAsyncThunk } from '@reduxjs/toolkit';
import { dynamicApi } from '../../../../../../lib/utils/api/apiClient';

export const chartTypeListQuery = createAsyncThunk(
    'userChartPreference/chartTypeListQuery',
    async (_, thunkAPI)  => {
        try {

            const response = await dynamicApi({
                method: 'GET',
                url: '/Owner/LKP_ChartTypeList',
                withCredentials: true
            });

            if (response.status === 204) return [];

            return [...response.data.items];

        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
