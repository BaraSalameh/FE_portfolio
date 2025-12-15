import axios from "axios";
import { dynamicApi } from "../utils";
import { ActionResult } from "../definitions/actions.definitions";
import { ValidateTokenResponse } from "../definitions/auth.definitions";

export const validateToken = async (): Promise<ActionResult<ValidateTokenResponse>> => {
    let response;

    try {
        response = await dynamicApi({
            method: "POST",
            url: '/Account/ValidateToken',
            data: {},
            retryOn401: false
        });
    } catch(error) {
        if(axios.isAxiosError(error)) {
            return { success: false, error: error.response?.data }
        }

        return { success: false, error: 'Unexpected error occurred!' }
    }

    return { success: true, data: response.data};
}

export const logout = async (): Promise<ActionResult> => {
    try {
        await dynamicApi({
            method: "POST",
            url: '/Account/Logout',
            data: {}
        });
    } catch {
        return { success: false, error: 'Unexpected error occurred!' }
    }
    
    return { success: true};
}

export const confirmEmail = async (token: string): Promise<ActionResult> => {
    try {
        const query = new URLSearchParams({
            token: token
        }).toString();

        await dynamicApi({
            method: 'GET',
            url: `/Account/ConfirmEmail?${query}`
        });
    } catch {
        return { success: false, error: 'Unexpected error occurred'};
    }
    
    return { success: true}
}