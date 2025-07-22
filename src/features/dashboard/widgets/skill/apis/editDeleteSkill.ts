import { dynamicApi } from "@/lib/utils";
import { transformPayload } from "@/lib/utils";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { SkillFormData } from "../schema";

export const editDeleteSkill = createAsyncThunk(
    'skill/editDeleteSkill',
    async (payload: SkillFormData, thunkAPI) => {
        try {
            const request = transformPayload(payload);

            await dynamicApi({
                method: 'POST',
                url: '/Owner/EditDeleteSkill',
                data: request,
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