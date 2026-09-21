import { createSlice } from '@reduxjs/toolkit';
import { dashboardHydrated } from '../../../dashboard.hydration';
import { editUserWidgetPreference, userWidgetPreferenceListQuery, widgetPreferenceListQuery } from './thunks';
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
        .addCase(dashboardHydrated, (state, action) => {
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
        .addCase(editUserWidgetPreference.fulfilled, (state, action) => {
            state.loading = false;
            const preference = state.preference.lstPreferences.find(
                (item) => item.id === action.payload.LKP_PreferenceID,
            );
            if (!preference) return;

            const index = state.lstUserPreferences.findIndex(
                (item) => item.preference?.id === preference.id || item.preference?.name === preference.name,
            );
            const savedPreference = { ...action.payload, preference };
            if (index === -1) state.lstUserPreferences.push(savedPreference);
            else state.lstUserPreferences[index] = { ...state.lstUserPreferences[index], ...savedPreference };
        })
        .addCase(editUserWidgetPreference.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
    },
});

export default userWidgetPreferenceSlice.reducer;
