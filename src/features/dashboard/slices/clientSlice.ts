import { createSlice } from "@reduxjs/toolkit";
import { userByUsernameQuery } from "../apis";
import { ProfileState } from "../types";

const clientInitialState: ProfileState = {
    user: null,
    loading: false,
    error: null,
};

const client = createSlice({
    name: 'client',
    initialState: clientInitialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(userByUsernameQuery.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(userByUsernameQuery.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
        })
        .addCase(userByUsernameQuery.rejected, (state, action) => {
            state.loading = false;
            state.error = (action.payload as string);
        });
    },
});

export const clientSlice = client.reducer;