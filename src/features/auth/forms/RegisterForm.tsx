'use client';

import { CheckboxField, FormError, SubmitButton, TextField } from '@/design-system';
import { registerSchema, type RegisterFormData } from '@/lib/schemas/registerSchema';
import { register as registerAccount } from '../actions';
import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition, useActionState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export function RegisterForm() {
    const [result, formAction, isPending] = useActionState(registerAccount, undefined);
    const { register, handleSubmit, formState: { errors } } = useForm<z.input<typeof registerSchema>, unknown, RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: { firstname: '', lastname: '', email: '', reEmail: '', password: '', rememberMe: false },
    });

    const onSubmit = handleSubmit((data) => startTransition(() => formAction(data)));

    return (
        <form onSubmit={onSubmit} className="space-y-5" noValidate>
            <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">Create your space</p>
                <h1 className="mt-2 text-3xl font-bold tracking-[-0.05em] sm:text-4xl">Start your portfolio</h1>
                <p className="mt-3 text-sm leading-6 text-ink-muted">Create your account now, then shape your professional story at your own pace.</p>
            </div>
            <FormError error={!result?.success ? result?.error : undefined} />
            <div className="grid gap-5 sm:grid-cols-2">
                <TextField label="First name" autoComplete="given-name" placeholder="Jane" registration={register('firstname')} error={errors.firstname} />
                <TextField label="Last name" autoComplete="family-name" placeholder="Doe" registration={register('lastname')} error={errors.lastname} />
            </div>
            <TextField label="Email" type="email" autoComplete="email" placeholder="jane.doe@example.com" registration={register('email')} error={errors.email} />
            <TextField label="Confirm email" type="email" autoComplete="email" placeholder="Re-enter your email" registration={register('reEmail')} error={errors.reEmail} />
            <TextField label="Password" type="password" autoComplete="new-password" placeholder="Create a secure password" registration={register('password')} error={errors.password} hint="Use 8+ characters with uppercase, lowercase, a number, and a symbol." />
            <CheckboxField label="Keep me signed in on this device" registration={register('rememberMe')} />
            <SubmitButton pending={isPending} pendingLabel="Creating your account…">Create account</SubmitButton>
        </form>
    );
}
