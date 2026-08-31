import { dashboardMutation } from "@/lib/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const deleteCertificate = createAsyncThunk(
    'certificate/deleteCertificate',
    async (id: string, thunkAPI) => {
        try {
            await dashboardMutation({
                method: 'DELETE',
                url: '/Owner/DeleteCertificate',
                data: {id},
                withCredentials: true
            });

            return;

        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    }
);
import { getApiErrorPayload } from "@/lib/utils";
