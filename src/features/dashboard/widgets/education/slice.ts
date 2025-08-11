import { createSlice } from '@reduxjs/toolkit';
import { institutionListQuery, degreeListQuery, fieldOfStudyListQuery, educationListQuery, addEditEducation, deleteEducation } from '@/features/dashboard/widgets/education/apis';
import { userFullInfoQuery } from '@/features';
import { userByUsernameQuery } from '@/features';
import { EducationState } from './types.education';
import { userSkillListQuery } from '../skill';
import { UserSkillResponse } from '../skill/types.skill';

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
        .addCase(userFullInfoQuery.fulfilled, (state, action) => {
            state.lstEducations = action.payload.lstEducations;
        })

        .addCase(userByUsernameQuery.fulfilled, (state, action) => {
            state.lstEducations = action.payload.lstEducations;
        })

        .addCase(userSkillListQuery.fulfilled, (state, action) => {
            state.lstEducations = state.lstEducations.map(edu => {
                const matchingSkills = action.payload
                    .filter((us: UserSkillResponse) => us.lstEducations?.find(e => e.id === edu.id))
                    .map(us => us.skill);

                return {
                    ...edu,
                    lstSkills: matchingSkills,
                };
            });
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
