'use client';

import { CheckboxField, FormError, SubmitButton, TextField } from '@/design-system';
import { loginSchema, type LoginFormData } from '@/lib/schemas/loginSchema';
import { authenticate } from '../actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition, useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export function LoginForm() {
    const [result, formAction, isPending] = useActionState(authenticate, undefined);
    const { register, handleSubmit, formState: { errors } } = useForm<z.input<typeof loginSchema>, unknown, LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '', rememberMe: false },
    });

    const onSubmit = handleSubmit((data) => startTransition(() => formAction(data)));

    return (
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <div className="mb-7">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Welcome back</p>
                <h1 className="mt-2 text-3xl font-bold tracking-[-0.05em] sm:text-4xl">Sign in to your portfolio</h1>
                <p className="mt-3 text-sm leading-6 text-ink-muted">Manage your profile, projects, and public presence.</p>
            </div>
            <FormError error={!result?.success ? result?.error : undefined} />
            <TextField label="Email" type="email" autoComplete="email" placeholder="you@example.com" registration={register('email')} error={errors.email} />
            <TextField label="Password" type="password" autoComplete="current-password" placeholder="Enter your password" registration={register('password')} error={errors.password} />
            <CheckboxField label="Remember me" registration={register('rememberMe')} />
            <SubmitButton pending={isPending} pendingLabel="Signing in…">Sign in</SubmitButton>
        </form>
    );
}
