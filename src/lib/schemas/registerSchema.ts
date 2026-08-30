import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

export const registerSchema = z.object({
    firstname: z
        .string()
        .trim()
        .min(2, { message: 'First name must be at least 2 characters' }),

    lastname: z
        .string()
        .trim()
        .min(2, { message: 'Last name must be at least 2 characters' }),

    email: z
        .string()
        .trim()
        .email({ message: 'Please enter a valid email address' }),
    
    reEmail: z
        .string()
        .trim()
        .email({ message: 'Please confirm with a valid email address' }),

    password: z
        .string()
        .min(8, { message: 'Password must be at least 8 characters long' })
        .regex(passwordRegex, {
            message: 'Password must include uppercase, lowercase, number and special character',
        }),

    rememberMe: z
        .boolean()
        .optional()
        .default(false)

}).superRefine((data, ctx) => {
    if (data.email !== data.reEmail) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['reEmail'],
            message: 'Emails do not match',
        });
    }
});
    
export type RegisterFormData = z.infer<typeof registerSchema>;