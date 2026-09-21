import { createSlice } from '@reduxjs/toolkit';
import { dashboardHydrated } from '../../../dashboard.hydration';
import { UserChartPreferenceState } from './types.chart-preferences';
import { chartTypeListQuery, editUserChartPreference, userChartPreferenceListQuery, widgetListQuery } from './thunks';

const initialState : UserChartPreferenceState = {
    lstUserChartPreferences: [],
    widget: {
        lstWidgets: [],
        loading: false,
        error: null as string | null
    },
    chartType: {
        lstChartTypes: [],
        loading: false,
        error: null as string | null
    },
    loading: false,
    error: null as string | null
}

const userChartPreferenceSlice = createSlice({
    name: 'userChartPreference',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(dashboardHydrated, (state, action) => {
            state.lstUserChartPreferences = action.payload.lstUserChartPreferences;
        })
        
        .addCase(userChartPreferenceListQuery.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(userChartPreferenceListQuery.fulfilled, (state, action) => {
            state.loading = false;
            state.lstUserChartPreferences = action.payload;
        })
        .addCase(userChartPreferenceListQuery.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        .addCase(widgetListQuery.pending, (state) => {
            state.widget.loading = true;
            state.widget.error = null;
        })
        .addCase(widgetListQuery.fulfilled, (state, action) => {
            state.widget.loading = false;
            state.widget.lstWidgets = action.payload;
        })
        .addCase(widgetListQuery.rejected, (state, action) => {
            state.widget.loading = false;
            state.widget.error = action.payload as string;
        })

        .addCase(chartTypeListQuery.pending, (state) => {
            state.chartType.loading = true;
            state.chartType.error = null;
        })
        .addCase(chartTypeListQuery.fulfilled, (state, action) => {
            state.chartType.loading = false;
            state.chartType.lstChartTypes = action.payload;
        })
        .addCase(chartTypeListQuery.rejected, (state, action) => {
            state.chartType.loading = false;
            state.chartType.error = action.payload as string;
        })
        
        .addCase(editUserChartPreference.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(editUserChartPreference.fulfilled, (state, action) => {
            state.loading = false;
            const widget = state.widget.lstWidgets.find((item) => item.id === action.payload.LKP_WidgetID);
            const chartType = state.chartType.lstChartTypes.find((item) => item.id === action.payload.LKP_ChartTypeID);
            if (!widget || !chartType) return;

            const index = state.lstUserChartPreferences.findIndex(
                (item) => (item.widget?.id === widget.id || item.widget?.name === widget.name)
                    && (item.chartType?.id === chartType.id || item.chartType?.name === chartType.name),
            );
            const savedPreference = { ...action.payload, widget, chartType };
            if (index === -1) state.lstUserChartPreferences.push(savedPreference);
            else state.lstUserChartPreferences[index] = {
                ...state.lstUserChartPreferences[index],
                ...savedPreference,
            };
        })
        .addCase(editUserChartPreference.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
    },
});

export default userChartPreferenceSlice.reducer;
