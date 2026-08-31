import { createSlice } from '@reduxjs/toolkit';
import { projectListQuery } from './apis';
import { dashboardHydrated } from '../../dashboard.hydration';
import { ProjectState } from './types.project';
import { userSkillListQuery } from '../skill';
import { syncParentFromUserSkill } from '@/lib/utils';

const initialState : ProjectState = {
    lstProjects: [],
    loading: false,
    error: null as string | null
}

const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        projectMutationStarted: (state) => {
            state.loading = true;
            state.error = null;
        },
        projectMutationSucceeded: (state, action: { payload: ProjectState['lstProjects'] }) => {
            state.loading = false;
            state.lstProjects = action.payload;
        },
        projectMutationFailed: (state, action: { payload: string }) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(dashboardHydrated, (state, action) => {
            state.lstProjects = action.payload.lstProjects;
        })

        .addCase(userSkillListQuery.fulfilled, (state, action) => {
            syncParentFromUserSkill(state, action.payload, "lstProjects");
        })
        
        .addCase(projectListQuery.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(projectListQuery.fulfilled, (state, action) => {
            state.loading = false;
            state.lstProjects = action.payload;
        })
        .addCase(projectListQuery.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { projectMutationFailed, projectMutationStarted, projectMutationSucceeded } = projectSlice.actions;
export default projectSlice.reducer;
