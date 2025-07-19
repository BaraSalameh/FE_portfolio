import { createSlice } from '@reduxjs/toolkit';
import { ProjectTechnologyState } from './types.project';
import { addEditDeleteProjectTechnology, deleteProject, projectTechnologyListQuery, technologyListQuery } from './apis';
import { userByUsernameQuery, userFullInfoQuery } from '@/features';

const initialState : ProjectTechnologyState = {
    lstProjectTechnologies: [],
    technology: {
        lstTechnologies: [],
        technologiesRowCount: 0,
        loading: false,
        error: null as string | null
    },
    loading: false,
    error: null as string | null
}

const projectTechnologySlice = createSlice({
    name: 'projectTechnology',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(userFullInfoQuery.fulfilled, (state, action) => {
            state.lstProjectTechnologies = action.payload.lstProjects;
        })

        .addCase(userByUsernameQuery.fulfilled, (state, action) => {
                state.lstProjectTechnologies = action.payload.lstProjects;
            })
        
        .addCase(projectTechnologyListQuery.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(projectTechnologyListQuery.fulfilled, (state, action) => {
            state.loading = false;
            state.lstProjectTechnologies = action.payload;
        })
        .addCase(projectTechnologyListQuery.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
        
        .addCase(technologyListQuery.pending, (state) => {
            state.technology.loading = true;
            state.technology.error = null;
        })
        .addCase(technologyListQuery.fulfilled, (state, action) => {
            const { items, rowCount, page } = action.payload;

            if (page === 0) {
                state.technology.lstTechnologies = items;
            } else {
                state.technology.lstTechnologies =  [...state.technology.lstTechnologies, ...items];
            }
            state.technology.loading = false;
            state.technology.technologiesRowCount = rowCount;
        })
        .addCase(technologyListQuery.rejected, (state, action) => {
            state.technology.loading = false;
            state.technology.error = action.payload as string;
        })
        
        .addCase(addEditDeleteProjectTechnology.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addEditDeleteProjectTechnology.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(addEditDeleteProjectTechnology.rejected, (state, action) => {
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

export default projectTechnologySlice.reducer;
