import { createSlice } from '@reduxjs/toolkit';
import { userByUsernameQuery, userFullInfoQuery } from '@/features';
import { editDeleteSkill, lkpSkillCategoryListQuery, lkpSkillListQuery, skillListQuery } from './apis';
import { SkillState } from './types.skill';

const initialState : SkillState = {
    lstSkills: [],
    lkpSkill: {
        lstSkills: [],
        skillsRowCount: 0,
        loading: false,
        error: null as string | null
    },
    lkpSkillCategory: {
        lstSkillCategories: [],
        skillCategoriesRowCount: 0,
        loading: false,
        error: null as string | null
    },
    loading: false,
    error: null as string | null
}

const skillSlice = createSlice({
    name: 'skill',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(userFullInfoQuery.fulfilled, (state, action) => {
            state.lstSkills = action.payload.lstSkills;
        })

        .addCase(userByUsernameQuery.fulfilled, (state, action) => {
            state.lstSkills = action.payload.lstSkills;
        })
        
        .addCase(skillListQuery.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(skillListQuery.fulfilled, (state, action) => {
            state.loading = false;
            state.lstSkills = action.payload;
        })
        .addCase(skillListQuery.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        .addCase(lkpSkillListQuery.pending, (state) => {
            state.lkpSkill.loading = true;
            state.lkpSkill.error = null;
        })
        .addCase(lkpSkillListQuery.fulfilled, (state, action) => {
            const { items, rowCount, page } = action.payload;

            if (page === 0) {
                state.lkpSkill.lstSkills = items;
            } else {
                state.lkpSkill.lstSkills =  [...state.lkpSkill.lstSkills, ...items];
            }
            state.lkpSkill.loading = false;
            state.lkpSkill.skillsRowCount = rowCount;
        })
        .addCase(lkpSkillListQuery.rejected, (state, action) => {
            state.lkpSkill.loading = false;
            state.lkpSkill.error = action.payload as string;
        })

        .addCase(lkpSkillCategoryListQuery.pending, (state) => {
            state.lkpSkillCategory.loading = true;
            state.lkpSkillCategory.error = null;
        })
        .addCase(lkpSkillCategoryListQuery.fulfilled, (state, action) => {
            const { items, rowCount, page } = action.payload;

            if (page === 0) {
                state.lkpSkillCategory.lstSkillCategories = items;
            } else {
                state.lkpSkillCategory.lstSkillCategories =  [...state.lkpSkillCategory.lstSkillCategories, ...items];
            }
            state.lkpSkillCategory.loading = false;
            state.lkpSkillCategory.skillCategoriesRowCount = rowCount;
        })
        .addCase(lkpSkillCategoryListQuery.rejected, (state, action) => {
            state.lkpSkillCategory.loading = false;
            state.lkpSkillCategory.error = action.payload as string;
        })
        
        .addCase(editDeleteSkill.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(editDeleteSkill.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(editDeleteSkill.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
    },
});

export default skillSlice.reducer;
