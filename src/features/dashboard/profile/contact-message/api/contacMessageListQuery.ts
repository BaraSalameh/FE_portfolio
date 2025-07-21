import { createAsyncThunk } from '@reduxjs/toolkit';
import { FetchAction } from '@/components/types.components';
import { dynamicApi } from "@/lib/utils";

export const contactMessageListQuery = createAsyncThunk(
    'contactMessage/contactMessageListQuery',
    async ({page = 0, pageSize = 5} : FetchAction, thunkAPI)  => {
        try {

            const response = await dynamicApi({
                method: 'GET',
                url: `/Owner/ContactMessageList?PageNumber=${page}&PageSize=${pageSize}`,
                withCredentials: true
            });

            if (response.status === 204) return {items: [], rowCount: 0, unreadContactMessageCount: 0, page};

            return { ...response.data, page };

        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);
