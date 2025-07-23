import { dynamicApi } from "@/lib/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { UserSkillFormData } from "../schema";

export const editDeleteUserSkill = createAsyncThunk(
    'userSkill/editDeleteUserSkill',
    async (payload: UserSkillFormData, thunkAPI) => {
        try {

            await dynamicApi({
                method: 'POST',
                url: '/Owner/EditDeleteUserSkill',
                data: payload,
                withCredentials: true
            });
            
            return;

        } catch (error: any) {
            if (error.response.status === 400) {
                return thunkAPI.rejectWithValue(error.response.data);
            }
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);