'use server';

import { redirect } from "next/navigation";
import { setCookies } from "@/lib/api/cookieHelpers";
import { LoginFormData } from "@/lib/schemas/loginSchema";
import { RegisterFormData } from "@/lib/schemas/registerSchema";
import { paths } from "@/lib/pathHelper";
import { LoginResponse } from "@/lib/definitions/auth.definitions";
import { ActionResult } from "@/lib/definitions/actions.definitions";
import { dynamicFetch } from "@/lib/api/fetchClient";
import { ApiError } from "../definitions/api.definitions";

export const authenticate = async (
    prevState: string | undefined,
    formData: LoginFormData
): Promise<ActionResult> => {
    let response;
    try {
        response = await dynamicFetch({
            method: "POST",
            url: "/Account/Login",
            data: formData,
        });
        
        await setCookies(response);

    } catch (error) {
        let errorMessage = 'Unknown login error occurred';
        if (error instanceof ApiError) {
            if (error.status === 403) redirect(paths.root.auth.email.path());
            errorMessage = error.message;
        }
        return {success: false, error: errorMessage};
    }

    const { role, username } = await response.json() as LoginResponse;
    redirect(`/${role}/${username}/dashboard`.toLowerCase());
}

export const register = async (
    prevState: string | undefined,
    formData: RegisterFormData
): Promise<ActionResult> => {
     try {
        await dynamicFetch({
            method: "POST",
            url: '/Account/Register',
            data: formData,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown register error occurred';
        return {success: false, error: errorMessage};
    }

    redirect(paths.root.auth.email.path());
}