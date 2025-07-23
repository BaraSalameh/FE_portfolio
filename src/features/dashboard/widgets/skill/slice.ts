import { createSlice } from '@reduxjs/toolkit';
import { userByUsernameQuery, userFullInfoQuery } from '@/features';
import { UserSkillState } from './types.skill';
import { editDeleteUserSkill, skillCategoryListQuery, skillListQuery, userSkillListQuery } from './apis';

const initialState : UserSkillState = {
    lstUserSkills: [],
    skill: {
        lstSkills: [],
        skillsRowCount: 0,
        loading: false,
        error: null as string | null
    },
    skillCategory: {
        lstSkillCategories: [],
        skillCategoriesRowCount: 0,
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

        .addCase(skillCategoryListQuery.pending, (state) => {
            state.skillCategory.loading = true;
            state.skillCategory.error = null;
        })
        .addCase(skillCategoryListQuery.fulfilled, (state, action) => {
            const { items, rowCount, page } = action.payload;

            if (page === 0) {
                state.skillCategory.lstSkillCategories = items;
            } else {
                state.skillCategory.lstSkillCategories =  [...state.skillCategory.lstSkillCategories, ...items];
            }
            state.skillCategory.loading = false;
            state.skillCategory.skillCategoriesRowCount = rowCount;
        })
        .addCase(skillCategoryListQuery.rejected, (state, action) => {
            state.skillCategory.loading = false;
            state.skillCategory.error = action.payload as string;
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
