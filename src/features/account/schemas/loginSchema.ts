import { emailRegex, passwordRegex } from '@/lib/utils';
import { z } from 'zod';

export const loginSchema = z.object({
    email: z.string().min(1, 'Email is required').regex(emailRegex, 'Not valid email'),
    password: z.string().min(8, "Password must be at least 8 characters long").regex(passwordRegex, "Password must include uppercase, lowercase, number, and symbol"),
    rememberMe: z.boolean()
});

export type LoginFormData = z.infer<typeof loginSchema>;
