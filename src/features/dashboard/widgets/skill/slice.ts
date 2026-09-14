import { createSlice } from '@reduxjs/toolkit';
import { dashboardHydrated } from '../../dashboard.hydration';
import { educationListQuery } from '../education/thunks';
import { experienceListQuery } from '../experience/thunks';
import { projectListQuery } from '../project/thunks';
import { UserSkillState } from './types.skill';
import { createSkill, editDeleteUserSkill, skillListQuery, userSkillListQuery } from './thunks';
import { certificateListQuery } from '../certificate';
import { EducationResponse } from '../education/types.education';
import { syncUserSkillsFromParentList } from '@/lib/utils';
import { CertificateResponse } from '../certificate/types.certificate';
import { ExperienceResponse } from '../experience/types.experience';
import { ProjectResponse } from '../project/types.project';
import { parentRecordDeleted, parentRecordSaved } from '../../dashboard.relationships';
import { syncUserSkillsFromParent } from '@/lib/utils';

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
        .addCase(createSkill.pending, (state) => {
            state.skill.loading = true;
            state.skill.error = null;
        })
        .addCase(createSkill.fulfilled, (state, action) => {
            state.skill.loading = false;
            if (!state.skill.lstSkills.some(skill => skill.id === action.payload.id)) {
                state.skill.lstSkills.push(action.payload);
            }
        })
        .addCase(createSkill.rejected, (state, action) => {
            state.skill.loading = false;
            state.skill.error = action.payload as string;
        })
        .addCase(dashboardHydrated, (state, action) => {
            state.lstUserSkills = action.payload.lstUserSkills;
        })
        .addCase(parentRecordSaved, (state, action) => {
            const { kind, record } = action.payload;
            if (kind === 'education') syncUserSkillsFromParent(record, state, item => item.institution, 'lstEducations');
            if (kind === 'experience') syncUserSkillsFromParent(record, state, item => item.companyName, 'lstExperiences');
            if (kind === 'project') syncUserSkillsFromParent(record, state, item => item.title, 'lstProjects');
            if (kind === 'certificate') syncUserSkillsFromParent(record, state, item => item.certificate, 'lstCertificates');
        })
        .addCase(parentRecordDeleted, (state, action) => {
            const parentField = {
                education: 'lstEducations',
                experience: 'lstExperiences',
                project: 'lstProjects',
                certificate: 'lstCertificates',
            }[action.payload.kind] as 'lstEducations' | 'lstExperiences' | 'lstProjects' | 'lstCertificates';

            state.lstUserSkills.forEach(userSkill => {
                const parents = userSkill[parentField];
                if (Array.isArray(parents)) {
                    userSkill[parentField] = parents.filter(parent => parent.id !== action.payload.id) as never;
                }
            });
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
        .addCase(editDeleteUserSkill.fulfilled, (state, action) => {
            state.loading = false;
            state.lstUserSkills = action.payload;
        })
        .addCase(editDeleteUserSkill.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
    },
});

export default userSkillSlice.reducer;
