'use server';

import { dynamicApi } from "../utils";
import { redirect } from "next/navigation";
import axios from "axios";
import { setCookies } from "./cookieHelpers";
import { LoginFormData } from "@/lib/schemas/loginSchema";
import { RegisterFormData } from "@/lib/schemas/registerSchema";
import { paths } from "../pathHelper";
import { LoginResponse } from "../definitions/auth.definitions";

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
            return error.status === 403
            ?   redirect(paths.root.auth.email.path())
            :   `${error.response?.data}`;
        }

        return 'Something went wrong!';
    }

    const { role, username } = response.data as LoginResponse;
    return redirect(`/${role}/${username}/dashboard`.toLowerCase());
}

export const register = async (prevState: string | undefined, formData: RegisterFormData) => {
     try {
        await dynamicApi({
            method: "POST",
            url: '/Account/Register',
            data: formData,
        });
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return error.response?.data;
        }

        return 'Something went wrong!';
    }

    return redirect(paths.root.auth.email.path());
}