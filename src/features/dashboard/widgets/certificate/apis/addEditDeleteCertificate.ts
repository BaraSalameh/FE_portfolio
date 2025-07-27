import { createAsyncThunk } from "@reduxjs/toolkit";
import { dynamicApi } from "@/lib/utils";
import { CertificateFormData } from "../schema";

export const addEditDeleteCertificate = createAsyncThunk(
    'certificate/addEditDeleteCertificate',
    async (payload: CertificateFormData, thunkAPI) => {
        try {

            await dynamicApi({
                method: 'POST',
                url: '/Owner/AddEditDeleteCertificate',
                data: payload,
                withCredentials: true
            });

            return;

        } catch (error: any) {
            if (error.response.status === 400) {
                return thunkAPI.rejectWithValue(error.response.data);
            }
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);