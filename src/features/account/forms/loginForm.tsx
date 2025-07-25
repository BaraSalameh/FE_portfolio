'use client';

import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { Paragraph } from "@/components/ui/Paragraph";
import { LoginFormData, loginSchema } from "@/features/account/schemas";
import { login } from "@/features";
import { ControlledForm } from "@/components/forms";

export const LoginForm = () => {

    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);
    
    const onSubmit = (data: LoginFormData) => {
        dispatch(login(data));
    };

    return(
        <ControlledForm
            schema={loginSchema}
            onSubmit={onSubmit}
            items={[
                {as: 'Input', name: 'email', label: 'Email', placeholder: 'john.doe@example.com'},
                {as: 'Input', name: 'password', label: 'Password', placeholder: '* * * * * * * *', type: 'Password'},
                {as: 'Checkbox', name: 'rememberMe', label: 'Remember me'},
            ]}
            error={error}
            loading={loading}
            defaultValues={{rememberMe: false}}
            indicator={{when: 'Login', while: 'Loging in...'}}
        >
            <Paragraph size="xl" className="py-3">
                Login
            </Paragraph>
        </ControlledForm>
    );
}