import { FetchAction } from '@/components/types';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { dynamicApi } from '../apiClient';

export const userListQuery = createAsyncThunk(
    'search/userListQuery',
    async ({query, page = 0, pageSize = 5}: FetchAction, thunkAPI) => {
        try{
            const response = await dynamicApi({
                method: "GET",
                url: `Client/UserList?Search=${query}&PageNumber=${page}&PageSize=${pageSize}`
            });
    
            if (response.status === 204) return {items: [], rowCount: 0, page};
    
            return {
                ...response.data,
                page
            };
        } catch (error) {
            return thunkAPI.rejectWithValue(['Unexpected error occurred']);
        }
    }
);
