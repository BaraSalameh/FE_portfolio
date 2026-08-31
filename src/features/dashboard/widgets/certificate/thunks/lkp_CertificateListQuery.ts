import { createAsyncThunk } from '@reduxjs/toolkit';
import { FetchAction } from '@/features/dashboard/types.presentation';
import { PaginatedResponse } from '@/lib/api/types';
import { LKP_CertificateSchemaFormData } from '../schema';
import { dashboardQuery } from "@/features/dashboard/requests";

export const lkp_CertificateListQuery = createAsyncThunk(
    'certificate/lkp_CertificateListQuery',
    async ({query, page = 0, pageSize = 5} : FetchAction, thunkAPI)  => {
        try {

            const response = await dashboardQuery<PaginatedResponse<LKP_CertificateSchemaFormData>>({
                method: 'GET',
                url: `/Owner/LKP_CertificateList?Search=${query}&PageNumber=${page}&PageSize=${pageSize}`,
                withCredentials: true
            });

            if (response.status === 204) return {items: [], rowCount: 0, page};

            return { ...response.data, page };

        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    }
);
import { getApiErrorPayload } from "@/lib/api/errors";
