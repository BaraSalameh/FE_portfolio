import { createSlice } from "@reduxjs/toolkit";
import { userFullInfoQuery } from "../apis";
import { logout } from "@/features";
import { ProfileState } from "../types";
import { userInfoQuery } from "../profile/apis";

const ownerInitialState: ProfileState = {
    user: null,
    loading: false,
    error: null,
};

const owner = createSlice({
    name: 'owner',
    initialState: ownerInitialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(userFullInfoQuery.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(userFullInfoQuery.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
        })
        .addCase(userFullInfoQuery.rejected, (state, action) => {
            state.loading = false;
            state.error = (action.payload as string);
        })
        
        .addCase(userInfoQuery.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(userInfoQuery.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        })
        .addCase(userInfoQuery.rejected, (state, action) => {
            state.loading = false;
            state.error = (action.payload as string);
        })
        
        .addCase(logout.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(logout.fulfilled, () => {
            return{
                loading: false,
                error: null,
                user: null
            }
        })
        .addCase(logout.rejected, (_, action) => {
            return {
                user: null,
                loading: false,
                error: action.payload as string,
            }
        })
    },
});

export const ownerSlice = owner.reducer;