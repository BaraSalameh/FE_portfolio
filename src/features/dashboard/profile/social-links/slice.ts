import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { dashboardHydrated } from '../../dashboard.hydration';
import type { SocialLinkResponse } from '../../types.dashboard';

const socialLinksSlice = createSlice({
    name: 'socialLinks',
    initialState: { items: [] as SocialLinkResponse[] },
    reducers: {
        socialLinksReplaced: (state, action: PayloadAction<SocialLinkResponse[]>) => {
            state.items = action.payload;
        },
    },
    extraReducers: (builder) => builder.addCase(dashboardHydrated, (state, action) => {
        state.items = action.payload.lstSocialLinks ?? [];
    }),
});

export const { socialLinksReplaced } = socialLinksSlice.actions;
export default socialLinksSlice.reducer;
