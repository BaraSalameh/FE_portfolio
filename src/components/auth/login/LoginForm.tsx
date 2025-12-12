'use client'

import { Paragraph } from "@/components/ui/Paragraph";
import { LoginFormData, loginSchema } from "@/lib/schemas/loginSchema";
import { ControlledForm } from "@/components/forms";
import { authenticate } from "@/lib/server-actions/auth.actions";
import { startTransition, useActionState } from "react";

export const LoginForm = () => {
    const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);
    
    const onSubmit = (data: LoginFormData) => {
        startTransition(() => {
            formAction(data)
        })
    };

    return(
        <ControlledForm
            schema={loginSchema}
            onSubmit={onSubmit}
            items={[
                {as: 'Input', name: 'email', label: 'Email', placeholder: 'Email Address'},
                {as: 'Input', name: 'password', label: 'Password', placeholder: 'Password', type: 'Password'},
                {as: 'Checkbox', name: 'rememberMe', label: 'Remember me'}
            ]}
            error={errorMessage}
            loading={isPending}
            defaultValues={{rememberMe: false}}
            indicator={{when: 'Login', while: 'Loging in...'}}
        >
            <Paragraph className="text-xl py-2">
                Login
            </Paragraph>
        </ControlledForm>
    );
}