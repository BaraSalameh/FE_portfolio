import { createSlice } from '@reduxjs/toolkit';
import { userByUsernameQuery, userFullInfoQuery } from '@/features';
import { editUserWidgetPreference, userWidgetPreferenceListQuery, widgetPreferenceListQuery } from './apis';
import { UserPreferenceState } from './types.widget-preferences';

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

const userWidgetPreferenceSlice = createSlice({
    name: 'userWidgetPreference',
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
        
        .addCase(userWidgetPreferenceListQuery.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(userWidgetPreferenceListQuery.fulfilled, (state, action) => {
            state.loading = false;
            state.lstUserPreferences = action.payload;
        })
        .addCase(userWidgetPreferenceListQuery.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        .addCase(widgetPreferenceListQuery.pending, (state) => {
            state.preference.loading = true;
            state.preference.error = null;
        })
        .addCase(widgetPreferenceListQuery.fulfilled, (state, action) => {
            state.preference.loading = false;
            state.preference.lstPreferences = action.payload;
        })
        .addCase(widgetPreferenceListQuery.rejected, (state, action) => {
            state.preference.loading = false;
            state.preference.error = action.payload as string;
        })
        
        .addCase(editUserWidgetPreference.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(editUserWidgetPreference.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(editUserWidgetPreference.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
    },
});

export default userWidgetPreferenceSlice.reducer;
