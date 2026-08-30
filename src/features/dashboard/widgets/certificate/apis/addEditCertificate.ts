import { createAsyncThunk } from "@reduxjs/toolkit";
import { dynamicApi } from "@/lib/utils";
import { CertificateFormData } from "../schema";

export const addEditCertificate = createAsyncThunk(
    'certificate/addEditCertificate',
    async (payload: CertificateFormData, thunkAPI) => {
        try {

            await dynamicApi({
                method: 'POST',
                url: '/Owner/AddEditCertificate',
                data: payload,
                withCredentials: true
            });

            return;

        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    }
);
import { getApiErrorPayload } from "@/lib/utils";
