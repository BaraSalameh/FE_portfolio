import { userByUsernameQuery } from '@/features';
import { addEditExperience, deleteExperience, experienceListQuery } from '@/features/dashboard/widgets/experience/apis';
import { createSlice } from '@reduxjs/toolkit';
import { ExperienceState } from './types.experience';
import { userFullInfoQuery } from '@/features';
import { userSkillListQuery } from '../skill';
import { syncParentFromUserSkill } from '@/lib/utils';

const initialState : ExperienceState = {
    lstExperiences: [],
    loading: false,
    error: null as string | null
}

const ExperienceSlice = createSlice({
    name: 'experience',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(userFullInfoQuery.fulfilled, (state, action) => {
            state.lstExperiences = action.payload.lstExperiences;
        })

        .addCase(userByUsernameQuery.fulfilled, (state, action) => {
            state.lstExperiences = action.payload.lstExperiences;
        })

        .addCase(userSkillListQuery.fulfilled, (state, action) => {
            syncParentFromUserSkill(state, action.payload, "lstExperiences");
        })

        .addCase(experienceListQuery.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(experienceListQuery.fulfilled, (state, action) => {
            state.loading = false;
            state.lstExperiences = action.payload;
        })
        .addCase(experienceListQuery.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
        
        .addCase(addEditExperience.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addEditExperience.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(addEditExperience.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        .addCase(deleteExperience.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteExperience.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(deleteExperience.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export default ExperienceSlice.reducer;
