import { createAsyncThunk } from '@reduxjs/toolkit';
import { FetchAction } from '@/features/dashboard/types.presentation';
import { PaginatedResponse } from '@/lib/definitions/api.definitions';
import { LKP_CertificateSchemaFormData } from '../schema';
import { dynamicApi } from "@/lib/utils";

export const lkp_CertificateListQuery = createAsyncThunk(
    'certificate/lkp_CertificateListQuery',
    async ({query, page = 0, pageSize = 5} : FetchAction, thunkAPI)  => {
        try {

            const response = await dynamicApi<PaginatedResponse<LKP_CertificateSchemaFormData>>({
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
import { getApiErrorPayload } from "@/lib/utils";
