import { createSlice } from '@reduxjs/toolkit';
import { userByUsernameQuery, userFullInfoQuery } from '@/lib/apis';
import { UserPreferenceState } from './types';
import { userPreferenceListQuery } from '@/lib/apis/owner/userPreference/userPreferenceListQuery';
import { preferenceListQuery } from '@/lib/apis/owner/userPreference/preferenceListQuery';
import { editUserPreference } from '@/lib/apis/owner/userPreference/editUserPreference';

const initialState : UserPreferenceState = {
    lstUserPreferences: [],
    preference: {
        lstPreferences: [],
        loading: false,
        error: null as string | null
    },
    loading: false,
    error: null as string | null
}

const userPreferenceSlice = createSlice({
    name: 'userPreference',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(userFullInfoQuery.fulfilled, (state, action) => {
            state.lstUserPreferences = action.payload.lstUserPreferences;
        })

        .addCase(userByUsernameQuery.fulfilled, (state, action) => {
            state.lstUserPreferences = action.payload.lstUserPreferences;
        })
        
        .addCase(userPreferenceListQuery.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(userPreferenceListQuery.fulfilled, (state, action) => {
            state.loading = false;
            state.lstUserPreferences = action.payload;
        })
        .addCase(userPreferenceListQuery.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        .addCase(preferenceListQuery.pending, (state) => {
            state.preference.loading = true;
            state.preference.error = null;
        })
        .addCase(preferenceListQuery.fulfilled, (state, action) => {
            state.preference.loading = false;
            state.preference.lstPreferences = action.payload;
        })
        .addCase(preferenceListQuery.rejected, (state, action) => {
            state.preference.loading = false;
            state.preference.error = action.payload as string;
        })
        
        .addCase(editUserPreference.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(editUserPreference.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(editUserPreference.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
    },
});

export default userPreferenceSlice.reducer;
