import axios from "axios";
import { dynamicApi } from "../utils";

export const validateToken = async () => {
    try {
        const response = await dynamicApi({
            method: "POST",
            url: '/Account/ValidateToken',
            data: {},
            retryOn401: false
        });

        return { success: true, data: response.data};
    } catch(error) {
        if(axios.isAxiosError(error)) {
            return { error: error.response?.data }
        }

        return { error: 'Unexpected error occurred!' }
    }
}

export const logout = async () => {
    try {
        await dynamicApi({
            method: "POST",
            url: '/Account/Logout',
            data: {}
        });

        return { success: true};
    } catch {
        return { error: 'Unexpected error occurred!' }
    }
}