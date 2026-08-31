import { createAsyncThunk } from '@reduxjs/toolkit';
import { FetchAction } from '@/features/dashboard/types.presentation';
import { dynamicApi } from "@/lib/utils";
import { PaginatedResponse } from '@/lib/definitions/api.definitions';
import { ContactMessageFormData } from '../schema';

interface ContactMessageListResponse extends PaginatedResponse<ContactMessageFormData> {
    unreadContactMessageCount: number;
}

export const contactMessageListQuery = createAsyncThunk(
    'contactMessage/contactMessageListQuery',
    async ({page = 0, pageSize = 5} : FetchAction, thunkAPI)  => {
        try {

            const response = await dynamicApi<ContactMessageListResponse>({
                method: 'GET',
                url: `/Owner/ContactMessageList?PageNumber=${page}&PageSize=${pageSize}`,
                withCredentials: true
            });

            if (response.status === 204) return {items: [], rowCount: 0, unreadContactMessageCount: 0, page};

            return { ...response.data, page };

        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    }
);
import { getApiErrorPayload } from "@/lib/utils";
