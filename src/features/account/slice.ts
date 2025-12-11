
import { createSlice } from '@reduxjs/toolkit';
import { confirmEmail, logout, register, resendEmail } from './apis';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        loading: false,
        error: null as string[] | null,
        username: null,
        isConfirmed: null as boolean | null,
        role: null
    },
    reducers: {
        clearAuth: (state) => {
            state.loading = false;
            state.error = null;
            state.username = null;
            state.isConfirmed = null;
            state.role = null;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            Object.assign(state, action.payload)
        })
        .addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = (action.payload as string[]);
        })

        .addCase(logout.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(logout.fulfilled, () => {
            return{
                loading: false,
                error: null,
                username: null,
                isConfirmed: null,
                role: null
            }
        })
        .addCase(logout.rejected, (_, action) => {
            return{
                loading: false,
                error: action.payload as string[],
                username: null,
                isConfirmed: null,
                role: null
            }
        })

        .addCase(confirmEmail.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(confirmEmail.fulfilled, (state, action) => {
            state.loading = false;
            Object.assign(state, action.payload);
        })
        .addCase(confirmEmail.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string[];
        })

        .addCase(resendEmail.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(resendEmail.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(resendEmail.rejected, (state, action) => {
            state.loading = false;
            state.error = (action.payload as string[]);
        });
    },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
