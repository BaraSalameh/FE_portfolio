import { dashboardMutation } from "@/features/dashboard/requests";
import type { RootState } from "@/lib/store/store";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserSkillFormData } from "../schema";
import { UserSkillResponse } from "../types.skill";

export const editDeleteUserSkill = createAsyncThunk(
    'userSkill/editDeleteUserSkill',
    async (payload: UserSkillFormData, thunkAPI) => {
        try {

            await dashboardMutation({
                method: 'POST',
                url: '/Owner/EditDeleteUserSkill',
                data: payload,
                withCredentials: true
            });
            
            const state = thunkAPI.getState() as RootState;

            return payload.lstUserSkills.flatMap<UserSkillResponse>((item) => {
                const skill = state.userSkill.lstUserSkills.find(userSkill => userSkill.skill.id === item.LKP_SkillID)?.skill
                    ?? state.userSkill.skill.lstSkills.find(candidate => candidate.id === item.LKP_SkillID);

                if (!skill) return [];

                const educationIDs = new Set(item.EducationIDs ?? []);
                const experienceIDs = new Set(item.ExperienceIDs ?? []);
                const projectIDs = new Set(item.ProjectIDs ?? []);
                const certificateIDs = new Set(item.CertificateIDs ?? []);

                return [{
                    skill,
                    lstEducations: state.education.lstEducations
                        .filter(education => educationIDs.has(education.id))
                        .map(education => ({
                            id: education.id,
                            institution: {
                                id: education.institution.id,
                                name: education.institution.name,
                                logo: education.institution.logo,
                            },
                        })),
                    lstExperiences: state.experience.lstExperiences
                        .filter(experience => experienceIDs.has(experience.id))
                        .map(experience => ({ id: experience.id, companyName: experience.companyName })),
                    lstProjects: state.project.lstProjects
                        .filter(project => projectIDs.has(project.id))
                        .map(project => ({ id: project.id, title: project.title })),
                    lstCertificates: state.certificate.lstCertificates
                        .filter(certificate => certificateIDs.has(certificate.id))
                        .map(certificate => ({
                            id: certificate.id,
                            certificate: {
                                id: certificate.certificate.id,
                                name: certificate.certificate.name,
                            },
                        })),
                }];
            });

        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    }
);
import { getApiErrorPayload } from "@/lib/api/errors";
