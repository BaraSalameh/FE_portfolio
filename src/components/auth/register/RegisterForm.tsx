'use client'

import { Paragraph } from "@/components/ui/Paragraph";
import { register } from "@/lib/server-actions/auth.actions";
import { RegisterFormData, registerSchema } from "@/lib/schemas/registerSchema";
import { ControlledForm } from "@/components/forms";
import { startTransition, useActionState } from "react";

export const RegisterForm = () => {

    const [ errorMessage, formAction, isPending ] = useActionState(register, undefined)

    const onSubmit = (data: RegisterFormData) => {
        startTransition(() => {
            formAction(data)
        })
    }

    return(
        <ControlledForm
            schema={registerSchema}
            onSubmit={onSubmit}
            items={[
                {as: 'Input', name: 'firstname', label: 'Firstname', placeholder: 'John'},
                {as: 'Input', name: 'lastname', label: 'Lastname', placeholder: 'Doe'},
                {as: 'Input', name: 'email', label: 'Email', placeholder: 'john.doe@example.com', type: 'Email'},
                {as: 'Input', name: 'reEmail', label: 'Confirm Email', placeholder: 'Re-enter your email', type: 'Email'},
                {as: 'Input', name: 'password', label: 'Password', placeholder: '* * * * * * * *', type: 'Password'},
                {as: 'Checkbox', name: 'rememberMe', label: 'Remember me'}
            ]}
            error={!errorMessage?.success ? errorMessage?.error : undefined}
            loading={isPending}
            indicator={{when: 'Register', while: 'Registering...'}}
        >
            <Paragraph className="text-xl py-2">
                Register
            </Paragraph>
        </ControlledForm>
    );
}