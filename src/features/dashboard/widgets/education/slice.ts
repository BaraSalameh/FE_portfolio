import { createSlice } from '@reduxjs/toolkit';
import { institutionListQuery, degreeListQuery, fieldOfStudyListQuery, educationListQuery, addEditEducation, deleteEducation, createFieldOfStudy, sortEducation } from '@/features/dashboard/widgets/education/thunks';
import { dashboardHydrated } from '../../dashboard.hydration';
import { EducationState } from './types.education';
import { editDeleteUserSkill, userSkillListQuery } from '../skill';
import { syncParentFromUserSkill } from '@/lib/utils';

const initialState : EducationState = {
    lstEducations: [],
    loading: false,
    error: null as string | null,
    institution: {
        lstInstitutions: [],
        institutionRowCount: 0,
        loading: false,
        error: null as string | null,
    },
    degree: {
        lstDegrees: [],
        degreeRowCount: 0,
        loading: false,
        error: null as string | null,
    },
    fieldOfStudy: {
        lstFields: [],
        fieldRowCount: 0,
        loading: false,
        error: null as string | null,
    }
}

const educationSlice = createSlice({
    name: 'education',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(dashboardHydrated, (state, action) => {
            state.lstEducations = action.payload.lstEducations;
        })

        .addCase(userSkillListQuery.fulfilled, (state, action) => {
            syncParentFromUserSkill(state, action.payload, "lstEducations");
        })
        .addCase(editDeleteUserSkill.fulfilled, (state, action) => {
            syncParentFromUserSkill(state, action.payload, "lstEducations");
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
            state.institution.loading = true;
            state.institution.error = null;
        })
        .addCase(institutionListQuery.fulfilled, (state, action) => {
            const { items, rowCount, page } = action.payload;

            if (page === 0) {
                state.institution.lstInstitutions = items;
            } else {
                state.institution.lstInstitutions =  [...state.institution.lstInstitutions, ...items];
            }
            state.institution.loading = false;
            state.institution.institutionRowCount = rowCount;
        })
        .addCase(institutionListQuery.rejected, (state, action) => {
            state.institution.loading = false;
            state.error = action.payload as string;
        })

        .addCase(degreeListQuery.pending, (state) => {
            state.degree.loading = true;
            state.degree.error = null;
        })
        .addCase(degreeListQuery.fulfilled, (state, action) => {
            const { items, rowCount, page } = action.payload;

            if (page === 0) {
                state.degree.lstDegrees = items;
            } else {
                state.degree.lstDegrees =  [...state.degree.lstDegrees, ...items];
            }
            state.degree.loading = false;
            state.degree.degreeRowCount = rowCount;
        })
        .addCase(degreeListQuery.rejected, (state, action) => {
            state.degree.loading = false;
            state.degree.error = action.payload as string;
        })

        .addCase(fieldOfStudyListQuery.pending, (state) => {
            state.fieldOfStudy.loading = true;
            state.fieldOfStudy.error = null;
        })
        .addCase(fieldOfStudyListQuery.fulfilled, (state, action) => {
            const { items, rowCount, page } = action.payload;

            if (page === 0) {
                state.fieldOfStudy.lstFields = items;
            } else {
                state.fieldOfStudy.lstFields =  [...state.fieldOfStudy.lstFields, ...items];
            }
            state.fieldOfStudy.loading = false;
            state.fieldOfStudy.fieldRowCount = rowCount;
        })
        .addCase(fieldOfStudyListQuery.rejected, (state, action) => {
            state.fieldOfStudy.loading = false;
            state.fieldOfStudy.error = action.payload as string;
        })

        .addCase(createFieldOfStudy.pending, (state) => {
            state.fieldOfStudy.loading = true;
            state.fieldOfStudy.error = null;
        })
        .addCase(createFieldOfStudy.fulfilled, (state, action) => {
            state.fieldOfStudy.loading = false;
            if (!state.fieldOfStudy.lstFields.some(field => field.id === action.payload.id)) {
                state.fieldOfStudy.lstFields.push(action.payload);
            }
        })
        .addCase(createFieldOfStudy.rejected, (state, action) => {
            state.fieldOfStudy.loading = false;
            state.fieldOfStudy.error = action.payload as string;
        })

        .addCase(addEditEducation.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addEditEducation.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.lstEducations.findIndex(item => item.id === action.payload.id);
            if (index === -1) state.lstEducations.push(action.payload);
            else state.lstEducations[index] = action.payload;
        })
        .addCase(addEditEducation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        .addCase(deleteEducation.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteEducation.fulfilled, (state, action) => {
            state.loading = false;
            state.lstEducations = state.lstEducations.filter(item => item.id !== action.payload);
        })
        .addCase(deleteEducation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        .addCase(sortEducation.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(sortEducation.fulfilled, (state, action) => {
            state.loading = false;
            const positions = new Map(action.payload.map((id, index) => [id, index]));
            state.lstEducations.sort((a, b) => (positions.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (positions.get(b.id) ?? Number.MAX_SAFE_INTEGER));
        })
        .addCase(sortEducation.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export default educationSlice.reducer;
