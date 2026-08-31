import { dashboardMutation } from "@/lib/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const sortCertificate = createAsyncThunk(
    'certificate/sortCertificate',
    async (payload: string[], thunkAPI) => {
        try {
            await dashboardMutation({
                method: 'POST',
                url: '/Owner/SortCertificate',
                data: {CertificateIdsInOrder: payload},
                withCredentials: true
            });

            return;

        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    }
);
import { getApiErrorPayload } from "@/lib/utils";
