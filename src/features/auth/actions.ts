'use server';

import { redirect } from "next/navigation";
import { setCookies } from "@/lib/api/cookies";
import { LoginFormData } from "@/lib/schemas/loginSchema";
import { RegisterFormData } from "@/lib/schemas/registerSchema";
import { paths } from "@/lib/pathHelper";
import { LoginResponse } from "@/lib/definitions/auth.definitions";
import { ActionResult } from "@/lib/definitions/actions.definitions";
import { serverApiResponse } from '@/lib/api/server-client';
import { ApiError } from '@/lib/api/types';

export const authenticate = async (
    _prevState: ActionResult | undefined,
    formData: LoginFormData
): Promise<ActionResult> => {
    let response;
    try {
        response = await serverApiResponse({
            method: "POST",
            url: "/Account/Login",
            data: formData,
            sendCredentials: false,
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
    _prevState: ActionResult | undefined,
    formData: RegisterFormData
): Promise<ActionResult> => {
     try {
        await serverApiResponse({
            method: "POST",
            url: '/Account/Register',
            data: formData,
            sendCredentials: false,
        });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown register error occurred';
        return {success: false, error: errorMessage};
    }

    redirect(paths.root.auth.email.path());
}
