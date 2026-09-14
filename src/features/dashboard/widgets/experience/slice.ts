import { dashboardHydrated } from '../../dashboard.hydration';
import { addEditExperience, deleteExperience, experienceListQuery, sortExperience } from '@/features/dashboard/widgets/experience/thunks';
import { createSlice } from '@reduxjs/toolkit';
import { ExperienceState } from './types.experience';
import { editDeleteUserSkill, userSkillListQuery } from '../skill';
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
        .addCase(dashboardHydrated, (state, action) => {
            state.lstExperiences = action.payload.lstExperiences;
        })

        .addCase(userSkillListQuery.fulfilled, (state, action) => {
            syncParentFromUserSkill(state, action.payload, "lstExperiences");
        })
        .addCase(editDeleteUserSkill.fulfilled, (state, action) => {
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
        .addCase(addEditExperience.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.lstExperiences.findIndex(item => item.id === action.payload.id);
            if (index === -1) state.lstExperiences.push(action.payload);
            else state.lstExperiences[index] = action.payload;
        })
        .addCase(addEditExperience.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        .addCase(deleteExperience.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteExperience.fulfilled, (state, action) => {
            state.loading = false;
            state.lstExperiences = state.lstExperiences.filter(item => item.id !== action.payload);
        })
        .addCase(deleteExperience.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        .addCase(sortExperience.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(sortExperience.fulfilled, (state, action) => {
            state.loading = false;
            const positions = new Map(action.payload.map((id, index) => [id, index]));
            state.lstExperiences.sort((a, b) => (positions.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (positions.get(b.id) ?? Number.MAX_SAFE_INTEGER));
        })
        .addCase(sortExperience.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export default ExperienceSlice.reducer;
