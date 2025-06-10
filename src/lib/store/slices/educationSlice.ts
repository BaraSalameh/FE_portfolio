import { createSlice } from '@reduxjs/toolkit';
import { institutionListQuery, degreeListQuery, fieldOfStudyListQuery, educationListQuery, addEditEducation, deleteEducation } from '@/lib/apis/owner/education';
import { userFullInfoQuery } from '@/lib/apis/owner/user';
import { EducationFormData } from '@/lib/schemas';
import { userByUsernameQuery } from '@/lib/apis/client';

interface EducationState {
    lstEducations: EducationFormData[];
    lstInstitutions: Record<string, any>[];
    institutionRowCount: number;
    lstDegrees: Record<string, any>[];
    lstFields: Record<string, any>[];
    loading: boolean;
    error: string | null;
}

const initialState : EducationState = {
    lstEducations: [],
    lstInstitutions: [],
    institutionRowCount: 0,
    lstDegrees: [],
    lstFields: [],
    loading: false,
    error: null as string | null
}

const educationSlice = createSlice({
    name: 'education',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(userFullInfoQuery.fulfilled, (state, action) => {
            state.lstEducations = action.payload.lstEducations;
        })

        .addCase(userByUsernameQuery.fulfilled, (state, action) => {
            state.lstEducations = action.payload.lstEducations;
        })

        .addCase(educationListQuery.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(educationListQuery.fulfilled, (state, action) => {
            state.loading = false;
            state.lstEducations = action.payload;
        })
        .addCase(educationListQuery.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        .addCase(institutionListQuery.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(institutionListQuery.fulfilled, (state, action) => {
            const { items, rowCount, page } = action.payload;

            if (page === 0) {
                state.lstInstitutions = items;
            } else {
                state.lstInstitutions =  [...state.lstInstitutions, ...items];
            }
            state.loading = false;
            state.institutionRowCount = rowCount;
        })
        .addCase(institutionListQuery.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        .addCase(degreeListQuery.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(degreeListQuery.fulfilled, (state, action) => {
            state.loading = false;
            state.lstDegrees = action.payload;
        })
        .addCase(degreeListQuery.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        .addCase(fieldOfStudyListQuery.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fieldOfStudyListQuery.fulfilled, (state, action) => {
            state.loading = false;
            state.lstFields = action.payload;
        })
        .addCase(fieldOfStudyListQuery.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        .addCase(addEditEducation.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addEditEducation.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(addEditEducation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        .addCase(deleteEducation.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteEducation.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(deleteEducation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export default educationSlice.reducer;
