import { guidRegex } from '@/lib/utils';
import { z } from 'zod';

export const educationSchema = z.object({
    id: z.string().optional(),

    LKP_InstitutionID: z
        .string()
        .min(1, 'Institution is required')
        .regex(guidRegex, 'Institution ID must be a valid GUID'),

    LKP_DegreeID: z
        .string()
        .min(1, 'Degree is required')
        .regex(guidRegex, 'Degree ID must be a valid GUID'),

    LKP_FieldOfStudyID: z
        .string()
        .min(1, 'Field is required')
        .regex(guidRegex, 'Field ID must be a valid GUID'),

    startDate: z.string()
        .refine(val => !isNaN(Date.parse(val)), { message: 'Start date not valid' }),

    endDate: z.string().optional().nullable(),

    description: z.string()
        .max(1000, 'Description is too long')
        .optional().nullable(),

    isStudying: z.boolean().optional(),

    lstSkills: z.array(z.string()).nullish(),
}).superRefine((data, ctx) => {
    const now = new Date();
    const start = new Date(data.startDate);

    if (isNaN(start.getTime())) {
        ctx.addIssue({
            path: ['startDate'],
            message: 'Start date not valid',
            code: z.ZodIssueCode.custom,
        });
    } else if (start > now) {
        ctx.addIssue({
            path: ['startDate'],
            message: 'Start date cannot be in the future',
            code: z.ZodIssueCode.custom,
        });
    }

    if (!data.isStudying) {
        if (!data.endDate) {
            ctx.addIssue({
                path: ['endDate'],
                message: 'End date is required if not still studying',
                code: z.ZodIssueCode.custom,
            });
        } else {
            const end = new Date(data.endDate);
            if (isNaN(end.getTime())) {
                ctx.addIssue({
                    path: ['endDate'],
                    message: 'End date not valid',
                    code: z.ZodIssueCode.custom,
                });
            } else {
                if (end > now) {
                    ctx.addIssue({
                        path: ['endDate'],
                        message: 'End date cannot be in the future',
                        code: z.ZodIssueCode.custom,
                    });
                }
                if (start > end) {
                    ctx.addIssue({
                        path: ['endDate'],
                        message: 'End date must be after start date',
                        code: z.ZodIssueCode.custom,
                    });
                }
            }
        }
    } else {
        data.endDate = null;
    }
});

export const institutionSchema = z.object({
    id: z.string(),
    name: z
        .string()
        .min(3, 'Name is too short'),
    logo: z
        .string()
        .max(1000, 'logo is too long'),
});

export const degreeSchema = z.object({
    id: z.string(),
    name: z
        .string()
        .min(3, 'Name is too short'),
    abbreviation: z
        .string()
        .max(3, 'Abbreviation is too long'),
});

export const fieldOfStudySchema = z.object({
    id: z.string(),
    name: z
        .string()
        .min(3, 'Name is too short'),
});

export type EducationFormData = z.infer<typeof educationSchema>;
export type InstitutionFormData = z.infer<typeof institutionSchema>;
export type DegreeFormData = z.infer<typeof degreeSchema>;
export type FieldOfStudyFormData = z.infer<typeof fieldOfStudySchema>;