import { createSlice } from '@reduxjs/toolkit';
import { userByUsernameQuery, userFullInfoQuery } from '@/features';
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

            // first, build a map of skill IDs to their certificates
            const skillIdToCertificate: Record<string, any> = {};

            certificates.forEach(cert => {
                cert.lstSkills?.forEach((skill: any) => {
                    skillIdToCertificate[skill.id] = {
                        id: cert.id,
                        certificate: cert.certificate,
                    };
                });
            });

            // update lstUserSkills based on that
            state.lstUserSkills = state.lstUserSkills.map((us: any) => {
                const skillId = us.skill.id;

                if (skillIdToCertificate[skillId]) {
                    // this skill is present in the latest certificate list
                    return {
                        ...us,
                        certificate: skillIdToCertificate[skillId],
                    };
                } else if (us.certificate !== null) {
                    // this skill used to have a certificate but no longer has one
                    return {
                        ...us,
                        certificate: null,
                    };
                }

                // skills unrelated to any certificate remain as they are
                return us;
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
