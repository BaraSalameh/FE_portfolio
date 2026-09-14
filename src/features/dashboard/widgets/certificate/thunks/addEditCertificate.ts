import { createAsyncThunk } from "@reduxjs/toolkit";
import { dashboardMutation } from "@/features/dashboard/requests";
import { CertificateFormData } from "../schema";
import { CertificateResponse } from "../types.certificate";

export const addEditCertificate = createAsyncThunk(
    'certificate/addEditCertificate',
    async (payload: CertificateFormData, thunkAPI) => {
        try {

            const response = await dashboardMutation<CertificateResponse>({
                method: 'POST',
                url: '/Owner/AddEditCertificate',
                data: payload,
                withCredentials: true
            });

            if (!response.data) {
                return thunkAPI.rejectWithValue('Certificate API returned no saved record. Restart or update the backend.');
            }

            return response.data;

        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    }
);
import { getApiErrorPayload } from "@/lib/api/errors";
