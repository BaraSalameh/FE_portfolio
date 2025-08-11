import { createSlice } from '@reduxjs/toolkit';
import { educationListQuery, experienceListQuery, projectListQuery, userByUsernameQuery, userFullInfoQuery } from '@/features';
import { UserSkillState } from './types.skill';
import { editDeleteUserSkill, skillListQuery, userSkillListQuery } from './apis';
import { certificateListQuery } from '../certificate';
import { EducationResponse } from '../education/types.education';
import { syncUserSkillsFromParentList } from '@/lib/utils';
import { CertificateResponse } from '../certificate/types.certificate';
import { ExperienceResponse } from '../experience/types.experience';
import { ProjectResponse } from '../project/types.project';

const initialState : UserSkillState = {
    lstUserSkills: [],
    skill: {
        lstSkills: [],
        skillsRowCount: 0,
        loading: false,
        error: null as string | null
    },
    loading: false,
    error: null as string | null
}

const userSkillSlice = createSlice({
    name: 'skill',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(userFullInfoQuery.fulfilled, (state, action) => {
            state.lstUserSkills = action.payload.lstUserSkills;
        })

        .addCase(userByUsernameQuery.fulfilled, (state, action) => {
            state.lstUserSkills = action.payload.lstUserSkills;
        })

        .addCase(educationListQuery.fulfilled, (state, action) => {
            const educations: EducationResponse[] = action.payload;

            syncUserSkillsFromParentList(
                educations,
                state,
                edu => edu.institution,
                "lstEducations"
            );
        })

        .addCase(certificateListQuery.fulfilled, (state, action) => {
            const certificates: CertificateResponse[] = action.payload;

            syncUserSkillsFromParentList(
                certificates,
                state,
                cert => cert.certificate,
                "lstCertificates"
            );
        })

        .addCase(experienceListQuery.fulfilled, (state, action) => {
            const experiences: ExperienceResponse[] = action.payload;

            syncUserSkillsFromParentList(
                experiences,
                state,
                exp => exp.companyName,
                "lstExperiences"
            );
        })

        .addCase(projectListQuery.fulfilled, (state, action) => {
            const projects: ProjectResponse[] = action.payload;

            syncUserSkillsFromParentList(
                projects,
                state,
                proj => proj.title,
                "lstProjects"
            );
        })

        .addCase(userSkillListQuery.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(userSkillListQuery.fulfilled, (state, action) => {
            state.loading = false;
            state.lstUserSkills = action.payload;
        })
        .addCase(userSkillListQuery.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        .addCase(skillListQuery.pending, (state) => {
            state.skill.loading = true;
            state.skill.error = null;
        })
        .addCase(skillListQuery.fulfilled, (state, action) => {
            const { items, rowCount, page } = action.payload;

            if (page === 0) {
                state.skill.lstSkills = items;
            } else {
                state.skill.lstSkills =  [...state.skill.lstSkills, ...items];
            }
            state.skill.loading = false;
            state.skill.skillsRowCount = rowCount;
        })
        .addCase(skillListQuery.rejected, (state, action) => {
            state.skill.loading = false;
            state.skill.error = action.payload as string;
        })
        
        .addCase(editDeleteUserSkill.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(editDeleteUserSkill.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(editDeleteUserSkill.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
    },
});

export default userSkillSlice.reducer;