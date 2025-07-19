import { createSlice } from "@reduxjs/toolkit";
import { userByUsernameQuery, userFullInfoQuery } from "../apis";
import { logout } from "@/features";
import { userInfoQuery } from "../profile/apis";
import { ProfileState } from "./types.profile";

const initialState: ProfileState = {
    user: null, 
    loading: false,
    error: null,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
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

export default profileSlice.reducer;