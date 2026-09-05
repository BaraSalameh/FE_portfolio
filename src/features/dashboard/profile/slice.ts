import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { dashboardHydrated } from '../dashboard.hydration';
import { userInfoQuery } from "../profile/thunks";
import type { ProfileImageField, ProfileState } from "./types.profile";

const initialState: ProfileState = {
    user: null, 
    loading: false,
    error: null,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        profileImageUpdated: (state, action: PayloadAction<{ field: ProfileImageField; url: string | null }>) => {
            if (state.user) state.user[action.payload.field] = action.payload.url;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(dashboardHydrated, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
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
    },
});

export const { profileImageUpdated } = profileSlice.actions;
export default profileSlice.reducer;
