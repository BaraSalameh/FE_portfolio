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
    reducers: {
        clearSearch: (state) => {
            state.userList = [];
            state.rowCount = 0;
            state.loading = false;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(userListQuery.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(userListQuery.fulfilled, (state, action) => {
            const { items, rowCount, page } = action.payload;

            if (page === 0) {
                state.userList = items;
            } else {
                state.userList =  [...state.userList, ...items];
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

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
