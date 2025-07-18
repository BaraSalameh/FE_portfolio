import { z } from 'zod';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

export const registerSchema = z
  .object({
    firstname: z.string().min(2, '2 Character at least'),
    lastname: z.string().min(2, '2 Character at least'),
    email: z.string().min(1, 'Email is required').regex(emailRegex, 'Not valid email'),
    reEmail: z.string().min(1, 'Please confirm your email').regex(emailRegex, 'Not valid email'),
    password: z.string().min(8, "Password must be at least 8 characters long").regex(passwordRegex, "Password must include uppercase, lowercase, number, and symbol"),
    rememberMe: z.boolean(),
  })
  .refine((data) => data.email === data.reEmail, {
    path: ['reEmail'],
    message: 'Emails do not match',
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
