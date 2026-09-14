import { createAsyncThunk } from '@reduxjs/toolkit';
import { browserApi } from '@/lib/api/browser-client';
import { getApiErrorPayload } from '@/lib/api/errors';
import { LKP_CertificateSchemaFormData } from '../schema';

export const createCertificate = createAsyncThunk(
    'certificate/createCertificate',
    async (name: string, thunkAPI) => {
        try {
            const response = await browserApi<LKP_CertificateSchemaFormData>({
                method: 'POST',
                url: '/Owner/AddLKP_Certificate',
                data: { name },
                sendCredentials: true,
            });
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    },
);
