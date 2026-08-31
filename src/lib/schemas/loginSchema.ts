import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(256, "Password must be at most 256 characters long"),

  rememberMe: z
    .boolean()
    .default(false)
});

export type LoginFormData = z.infer<typeof loginSchema>;
