import { dashboardQuery } from "@/features/dashboard/requests";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PaginatedResponse } from '@/lib/api/types';
import { CertificateResponse } from '../types.certificate';

export const certificateListQuery = createAsyncThunk(
    'certificate/certificateListQuery',
    async (_, thunkAPI)  => {
        try {

            const response = await dashboardQuery<PaginatedResponse<CertificateResponse>>({
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
import { getApiErrorPayload } from "@/lib/api/errors";
