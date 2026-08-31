import { dashboardMutation } from "@/lib/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserSkillFormData } from "../schema";

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
            
            return;

        } catch (error) {
            return thunkAPI.rejectWithValue(getApiErrorPayload(error));
        }
    }
);
import { getApiErrorPayload } from "@/lib/utils";
