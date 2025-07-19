import { createSlice } from '@reduxjs/toolkit';
import {  userFullInfoQuery } from '@/features';
import { ContactMessageState } from './types.contact-message';
import { contactMessageListQuery, deleteMessage, signMessage } from './api';

const initialState : ContactMessageState = {
    lstMessages: [],
    unreadContactMessageCount: 0,
    rowCount: 0,
    loading: false,
    error: null as string | null
}

const contactMessageSlice = createSlice({
    name: 'contactMessage',
    initialState,
    reducers: {
        removeMessage: (state, action) => {
            const id = action.payload;
            state.lstMessages = state.lstMessages.filter(msg => msg.id !== id);
            state.rowCount = state.rowCount - 1;
        },

        markMessage: (state, action) => {
            const id = action.payload;
            const message = state.lstMessages.find(msg => msg.id === id);

            if (message && !message.isRead) {
                message.isRead = true;
                state.unreadContactMessageCount -= 1;
            }
        }
    },
    extraReducers: (builder) => {
        builder

        .addCase(userFullInfoQuery.fulfilled, (state, action) => {
            state.unreadContactMessageCount = action.payload.unreadContactMessageCount;
        })

        .addCase(contactMessageListQuery.pending, (state) => {
            state.loading = false;
            state.error = null;
        })
        .addCase(contactMessageListQuery.fulfilled, (state, action) => {
            const { unreadContactMessageCount, items, rowCount, page } = action.payload;

            if (page === 0) {
                state.lstMessages = items;
            } else {
                state.lstMessages =  [...state.lstMessages, ...items];
            }
            state.loading = false;
            state.unreadContactMessageCount = unreadContactMessageCount;
            state.rowCount = rowCount;
        })
        .addCase(contactMessageListQuery.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        .addCase(signMessage.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(signMessage.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(signMessage.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })

        .addCase(deleteMessage.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteMessage.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(deleteMessage.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { removeMessage, markMessage } = contactMessageSlice.actions; 
export default contactMessageSlice.reducer;
