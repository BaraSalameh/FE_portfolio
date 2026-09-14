import { createSlice } from '@reduxjs/toolkit';
import { addEditProject, deleteProject, projectListQuery, sortProject } from './thunks';
import { dashboardHydrated } from '../../dashboard.hydration';
import { ProjectState } from './types.project';
import { editDeleteUserSkill, userSkillListQuery } from '../skill';
import { syncParentFromUserSkill } from '@/lib/utils';

const initialState : ProjectState = {
    lstProjects: [],
    loading: false,
    error: null as string | null
}

const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(dashboardHydrated, (state, action) => {
            state.lstProjects = action.payload.lstProjects;
        })

        .addCase(userSkillListQuery.fulfilled, (state, action) => {
            syncParentFromUserSkill(state, action.payload, "lstProjects");
        })
        .addCase(editDeleteUserSkill.fulfilled, (state, action) => {
            syncParentFromUserSkill(state, action.payload, "lstProjects");
        })

        .addCase(addEditProject.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addEditProject.fulfilled, (state, action) => {
            state.loading = false;
            const index = state.lstProjects.findIndex(item => item.id === action.payload.id);
            if (index === -1) state.lstProjects.push(action.payload);
            else state.lstProjects[index] = action.payload;
        })
        .addCase(addEditProject.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        .addCase(deleteProject.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteProject.fulfilled, (state, action) => {
            state.loading = false;
            state.lstProjects = state.lstProjects.filter(item => item.id !== action.payload);
        })
        .addCase(deleteProject.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        .addCase(sortProject.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(sortProject.fulfilled, (state, action) => {
            state.loading = false;
            const positions = new Map(action.payload.map((id, index) => [id, index]));
            state.lstProjects.sort((a, b) => (positions.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (positions.get(b.id) ?? Number.MAX_SAFE_INTEGER));
        })
        .addCase(sortProject.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
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

export default projectSlice.reducer;
