import { createSlice } from '@reduxjs/toolkit';
import { userListQuery } from '@/lib/apis/client/userListQuery';

interface SearchState {
    userList: any[];
    rowCount: number;
    loading: boolean;
    error: string | null;
}

const initialState : SearchState = {
    userList: [],
    rowCount: 0,
    loading: false,
    error: null as string | null
}

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(userListQuery.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(userListQuery.fulfilled, (state, action) => {
            const { lstUsers, rowCount, page } = action.payload;

            if (page === 0) {
                state.userList = lstUsers;
            } else {

                state.userList =  [...state.userList, ...lstUsers];
            }
            state.loading = false;
            state.rowCount = rowCount;
        })
        .addCase(userListQuery.rejected, (state) => {
            state.loading = false;
            state.error = 'Unexpected error occurred';
        });
    },
});

export default searchSlice.reducer;
