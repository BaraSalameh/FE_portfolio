import { dynamicApi } from "@/lib/utils";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PaginatedResponse } from '@/lib/definitions/api.definitions';
import { CertificateResponse } from '../types.certificate';

export const certificateListQuery = createAsyncThunk(
    'certificate/certificateListQuery',
    async (_, thunkAPI)  => {
        try {

            const response = await dynamicApi<PaginatedResponse<CertificateResponse>>({
                method: 'GET',
                url: '/Owner/CertificateList',
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
