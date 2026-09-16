import { dashboardQuery } from "@/features/dashboard/requests";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { PaginatedResponse } from '@/lib/api/types';
import { WidgetPreferenceFormData } from '../schema';

export const widgetPreferenceListQuery = createAsyncThunk(
    'userWidgetPreference/widgetPreferenceListQuery',
    async (_, thunkAPI)  => {
        try {
            const pageSize = 10;
            const loadPage = (pageNumber: number) => dashboardQuery<PaginatedResponse<WidgetPreferenceFormData>>({
                method: 'GET',
                url: `/Owner/LKP_PreferenceList?PageNumber=${pageNumber}&PageSize=${pageSize}`,
                withCredentials: true,
            });

            const firstPage = await loadPage(0);
            if (firstPage.status === 204) return [];

            const pageCount = Math.ceil(firstPage.data.rowCount / pageSize);
            const remainingPages = pageCount > 1
                ? await Promise.all(Array.from({ length: pageCount - 1 }, (_, index) => loadPage(index + 1)))
                : [];

            const preferences = [firstPage, ...remainingPages]
                .flatMap((response) => response.status === 204 ? [] : response.data.items);

            return Array.from(
                new Map(preferences.map((preference) => [preference.id, preference])).values(),
            );

        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    }
);
import { getApiErrorPayload } from "@/lib/api/errors";
