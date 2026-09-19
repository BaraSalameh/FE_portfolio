'use server';

import { redirect } from "next/navigation";
import { setCookies } from "@/lib/api/cookies";
import { loginSchema, LoginFormData } from "@/lib/schemas/loginSchema";
import { RegisterFormData } from "@/lib/schemas/registerSchema";
import { paths } from "@/lib/pathHelper";
import { LoginResponse } from "@/lib/definitions/auth.definitions";
import { ActionResult } from "@/lib/definitions/actions.definitions";
import { serverApiResponse } from '@/lib/api/server-client';
import { ApiError } from '@/lib/api/types';
import { safeAppPath } from '@/lib/api/auth-navigation';

export const authenticate = async (
    requestedReturnTo: string | undefined,
    _prevState: ActionResult | undefined,
    formData: LoginFormData
): Promise<ActionResult> => {
    let identity: LoginResponse;
    try {
        const parsed = loginSchema.safeParse(formData);
        if (!parsed.success) return { success: false, error: 'Please check your email and password.' };
        const response = await serverApiResponse({
            method: "POST",
            url: "/Account/Login",
            data: parsed.data,
            sendCredentials: false,
        });
        identity = await response.json() as LoginResponse;
        if (typeof identity?.role !== 'string' || !identity.role || typeof identity?.username !== 'string' || !identity.username) {
            return { success: false, error: 'The sign-in response was invalid. Please try again.' };
        }
        await setCookies(response);

    } catch (error) {
        let errorMessage = 'Unknown login error occurred';
        if (error instanceof ApiError) {
            if (error.status === 403) redirect(paths.root.auth.email.path());
            errorMessage = error.message;
        }
        return {success: false, error: errorMessage};
    }

    const returnTo = safeAppPath(requestedReturnTo);
    if (returnTo) redirect(returnTo);

    redirect(`/${encodeURIComponent(identity.role.toLowerCase())}/${encodeURIComponent(identity.username)}/dashboard`);
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
