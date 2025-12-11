'use server';

import { dynamicApi } from "../utils";
import { redirect } from "next/navigation";
import axios from "axios";
import { setCookies } from "./cookieHelpers";
import { LoginFormData } from "@/lib/schemas/loginSchema";

export const authenticate = async (prevState: string | undefined, formData: LoginFormData) => {
    let response;
    try {
        response = await dynamicApi({
            method: "POST",
            url: "/Account/Login",
            data: formData,
        });
        
        await setCookies(response);

    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response?.data;
        }

        return 'Something went wrong!';
    }

    const { role, username } = response.data;
    return redirect(`/${role}/${username}/dashboard`.toLowerCase());
}
