import { createSlice } from '@reduxjs/toolkit';
import { UserLanguageState } from './types';
import { userByUsernameQuery, userFullInfoQuery } from '@/features';
import { editDeleteUserLanguage, languageListQuery, languageProficiencyListQuery, userLanguageListQuery } from './apis';

const initialState : UserLanguageState = {
    lstUserLanguages: [],
    language: {
        lstLanguages: [],
        languagesRowCount: 0,
        loading: false,
        error: null as string | null
    },
    languageProficiency: {
        lstLanguageProficiencies: [],
        loading: false,
        error: null as string | null
    },
    loading: false,
    error: null as string | null
}

const userLanguageSlice = createSlice({
    name: 'userLanguage',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(userFullInfoQuery.fulfilled, (state, action) => {
            state.lstUserLanguages = action.payload.lstUserLanguages;
        })

        .addCase(userByUsernameQuery.fulfilled, (state, action) => {
            state.lstUserLanguages = action.payload.lstUserLanguages;
        })
        
        .addCase(userLanguageListQuery.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(userLanguageListQuery.fulfilled, (state, action) => {
            state.loading = false;
            state.lstUserLanguages = action.payload;
        })
        .addCase(userLanguageListQuery.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        .addCase(languageListQuery.pending, (state) => {
            state.language.loading = true;
            state.language.error = null;
        })
        .addCase(languageListQuery.fulfilled, (state, action) => {
            const { items, rowCount, page } = action.payload;

            if (page === 0) {
                state.language.lstLanguages = items;
            } else {
                state.language.lstLanguages =  [...state.language.lstLanguages, ...items];
            }
            state.language.loading = false;
            state.language.languagesRowCount = rowCount;
        })
        .addCase(languageListQuery.rejected, (state, action) => {
            state.language.loading = false;
            state.language.error = action.payload as string;
        })
        
        .addCase(languageProficiencyListQuery.pending, (state) => {
            state.languageProficiency.loading = true;
            state.languageProficiency.error = null;
        })
        .addCase(languageProficiencyListQuery.fulfilled, (state, action) => {
            state.languageProficiency.loading = false;
            state.languageProficiency.lstLanguageProficiencies = action.payload;
        })
        .addCase(languageProficiencyListQuery.rejected, (state, action) => {
            state.languageProficiency.loading = false;
            state.languageProficiency.error = action.payload as string;
        })
        
        .addCase(editDeleteUserLanguage.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(editDeleteUserLanguage.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(editDeleteUserLanguage.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
    },
});

export default userLanguageSlice.reducer;
