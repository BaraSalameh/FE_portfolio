import { createAsyncThunk } from '@reduxjs/toolkit';

export const userListQuery = createAsyncThunk(
    'search/userListQuery',
    async ({query, page = 0, pageSize = 5}: {query: string, page: number, pageSize?: number}) => {

        const res = await fetch(`https://localhost:7206/api/Client/UserList?Search=${query}&PageNumber=${page}&PageSize=${pageSize}`);

        if (res.status === 204) return {items: [], rowCount: 0, page};
        
        const result = await res.json();
        return {
            ...result,
            page,
        }
    }
);
