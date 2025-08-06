import { createSlice } from '@reduxjs/toolkit';
import { addEditProject, deleteProject, projectListQuery } from './apis';
import { userByUsernameQuery, userFullInfoQuery } from '@/features';
import { ProjectState } from './types.project';
import { userSkillListQuery } from '../skill';

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
        .addCase(userFullInfoQuery.fulfilled, (state, action) => {
            state.lstProjects = action.payload.lstProjects;
        })

        .addCase(userByUsernameQuery.fulfilled, (state, action) => {
            state.lstProjects = action.payload.lstProjects;
        })

        .addCase(userSkillListQuery.fulfilled, (state, action) => {
            state.lstProjects = state.lstProjects.map(proj => {
                const matchingSkills = action.payload
                    .filter(us => us.project?.id === proj.id)
                    .map(us => us.skill);

                return {
                    ...proj,
                    lstSkills: matchingSkills,
                };
            });
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
        })
        
        .addCase(addEditProject.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addEditProject.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(addEditProject.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        .addCase(deleteProject.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteProject.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(deleteProject.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export default projectSlice.reducer;
