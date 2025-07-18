
import { createSlice } from '@reduxjs/toolkit';
import { confirmEmail, login, logout, register, resendEmail, validateToken } from './apis';

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
        .addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            Object.assign(state, action.payload);
        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false;
            if (Array.isArray(action.payload)){
                state.error = (action.payload as string[]);
            } else {
                Object.assign(state, action.payload)
            }
        })

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

        .addCase(validateToken.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(validateToken.fulfilled, (state, action) => {
            state.loading = false;
            Object.assign(state, action.payload)
        })
        .addCase(validateToken.rejected, (state, action) => {
            state.loading = false;
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
