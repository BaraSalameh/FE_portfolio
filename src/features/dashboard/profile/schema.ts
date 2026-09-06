import { z } from 'zod';

const phoneRegex = /^\+?[1-9]\d{1,14}$/;
const addressRegex = /^\p{L}[\p{L}\p{M} .'-]* - \p{L}[\p{L}\p{M} .'-]*$/u;

export const profileSchema = z.object({
    username: z
        .string()
        .nullable(),

    email: z
        .string()
        .nullable(),
        
    firstname: z
        .string()
        .min(2, 'First name is required'),

    lastname: z
        .string()
        .min(2, 'Last name is required'),

    title: z
        .string()
        .min(2, 'title is required')
        .optional()
        .nullable(),

    bio: z
        .string()
        .max(1000, 'Bio is too long')
        .optional()
        .nullable(),

    address: z
        .string()
        .trim()
        .max(120, 'Address is too long')
        .optional()
        .nullable()
        .refine((val) => !val || addressRegex.test(val), {
            message: 'Use the format City - Country (for example, Istanbul - Turkey)'
        }),

    whatsAppNumber: z
        .string()
        .optional()
        .nullable()
        .refine((val) => !val || /^\+[1-9]\d{7,14}$/.test(val), {
            message: 'Use international format, for example +905551234567'
        }),

    cvUrl: z
        .string()
        .url()
        .max(2048)
        .optional()
        .nullable(),

    phone: z
        .string()
        .optional()
        .nullable()
        .refine((val) => {
            if (!val) return true;
            return val.length >= 9;
        }, { message: 'Phone is short' })
        .refine((val) => {
            if (!val) return true;
            return phoneRegex.test(val);
        }, { message: 'Phone must be valid' }),

    profilePicture: z
        .string()
        .max(1000, 'Image string is too long')
        .optional()
        .nullable(),

    coverPhoto: z
        .string()
        .max(1000, 'Image string is too long')
        .optional()
        .nullable(),

    gender: z
        .string()
        .optional()
        .nullable(),

    birthDate: z
        .string()
        .optional()
        .nullable()
        .refine(val => {
            if (!val) return true; // allow null or undefined
            return !isNaN(Date.parse(val));
        }, {
            message: 'Birthdate not valid'
        })

}).superRefine((data, ctx) => {
    if (!data.birthDate) return; // Skip if null or undefined

    const birthDate = new Date(data.birthDate);
    const now = new Date();

    if (isNaN(birthDate.getTime())) {
        ctx.addIssue({
        path: ['birthDate'],
        message: 'Birthdate not valid',
        code: z.ZodIssueCode.custom,
        });
    } else if (birthDate > now) {
        ctx.addIssue({
        path: ['birthDate'],
        message: 'Birthdate cannot be in the future',
        code: z.ZodIssueCode.custom,
        });
    }
});

export type ProfileFormData = z.infer<typeof profileSchema>;
