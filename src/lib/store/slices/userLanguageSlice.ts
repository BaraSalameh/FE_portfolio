import { createSlice } from '@reduxjs/toolkit';
import { UserLanguageFormData } from '@/lib/schemas';
import { userByUsernameQuery, userFullInfoQuery, editDeleteUserLanguage, languageListQuery, languageProficiencyListQuery, userLanguageListQuery } from '@/lib/apis';

interface UserLanguageState {
    lstUserLanguages: UserLanguageFormData[],
    lstLanguages: Record<string, any>[];
    languagesRowCount: number;
    lstLanguageProficiencies: Record<string, any>[];
    loading: boolean;
    error: string | null;
}

const initialState : UserLanguageState = {
    lstUserLanguages: [],
    lstLanguages: [],
    languagesRowCount: 0,
    lstLanguageProficiencies: [],
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
            state.loading = true;
            state.error = null;
        })
        .addCase(languageListQuery.fulfilled, (state, action) => {
            const { items, rowCount, page } = action.payload;

            if (page === 0) {
                state.lstLanguages = items;
            } else {
                state.lstLanguages =  [...state.lstLanguages, ...items];
            }
            state.loading = false;
            state.languagesRowCount = rowCount;
        })
        .addCase(languageListQuery.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
        
        .addCase(languageProficiencyListQuery.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(languageProficiencyListQuery.fulfilled, (state, action) => {
            state.loading = false;
            state.lstLanguageProficiencies = action.payload;
        })
        .addCase(languageProficiencyListQuery.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
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
