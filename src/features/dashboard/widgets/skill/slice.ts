import { createSlice } from '@reduxjs/toolkit';
import { projectListQuery, userByUsernameQuery, userFullInfoQuery } from '@/features';
import { UserSkillState } from './types.skill';
import { editDeleteUserSkill, skillListQuery, userSkillListQuery } from './apis';
import { certificateListQuery } from '../certificate';

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

        .addCase(certificateListQuery.fulfilled, (state, action) => {
            const certificates = action.payload;

            // Build a map of skill ID → full certificate link
            const skillIdToCertificate: Record<string, any> = {};

            certificates.forEach(cert => {
                cert.lstSkills?.forEach((skill: any) => {
                    skillIdToCertificate[skill.id] = {
                        id: cert.id, // the UserCertificate ID
                        certificate: cert.certificate, // the lookup certificate object
                        skill: skill
                    };
                });
            });

            // Track current skills to avoid duplicate adds
            const existingSkillIds = new Set(state.lstUserSkills.map(us => us.skill.id));

            // Update or clean up certificate links for existing skills
            state.lstUserSkills = state.lstUserSkills.map(us => {
                const skillId = us.skill.id;
                const certEntry = skillIdToCertificate[skillId];

                if (certEntry) {
                    // Update or overwrite certificate
                    return {
                        ...us,
                        certificate: {
                            id: certEntry.id,
                            certificate: certEntry.certificate
                        }
                    };
                } else if (us.certificate) {
                    // Certificate removed, clean it
                    const { certificate, ...rest } = us;
                    return { ...rest };
                }

                // No change
                return us;
            });

            // Add new skills not already in lstUserSkills
            Object.entries(skillIdToCertificate).forEach(([skillId, certEntry]) => {
                if (!existingSkillIds.has(skillId)) {
                    state.lstUserSkills.push({
                        skill: certEntry.skill,
                        certificate: {
                            id: certEntry.id,
                            certificate: certEntry.certificate
                        }
                    });
                }
            });
        })


        .addCase(projectListQuery.fulfilled, (state, action) => {
            const projects = action.payload;

            // Build a map of skill ID → full project link
            const skillIdToProject: Record<string, any> = {};

            projects.forEach(proj => {
                proj.lstSkills?.forEach((skill: any) => {
                    skillIdToProject[skill.id] = {
                        id: proj.id,
                        title: proj.title,
                        skill: skill
                    };
                });
            });

            // Track current skills to avoid duplicate adds
            const existingSkillIds = new Set(state.lstUserSkills.map(us => us.skill.id));

            // Update or clean up certificate links for existing skills
            state.lstUserSkills = state.lstUserSkills.map(us => {
                const skillId = us.skill.id;
                const projEntry = skillIdToProject[skillId];

                if (projEntry) {
                    // Update or overwrite certificate
                    return {
                        ...us,
                        project: {
                            id: projEntry.id,
                            title: projEntry.title
                        }
                    };
                } else if (us.project) {
                    // Certificate removed, clean it
                    const { project, ...rest } = us;
                    return { ...rest };
                }

                // No change
                return us;
            });

            // Add new skills not already in lstUserSkills
            Object.entries(skillIdToProject).forEach(([skillId, projEntry]) => {
                if (!existingSkillIds.has(skillId)) {
                    state.lstUserSkills.push({
                        skill: projEntry.skill,
                        project: {
                            id: projEntry.id,
                            title: projEntry.title
                        }
                    });
                }
            });
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
