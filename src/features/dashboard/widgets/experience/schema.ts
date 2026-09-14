import { z } from 'zod';

export const experienceSchema = z.object({
    id: z.string().optional(),

    jobTitle: z
        .string().trim()
        .min(2, 'Job title is too short')
        .max(120, 'Job title is too long'),

    companyName: z
        .string().trim()
        .min(2, 'Company name is too short')
        .max(120, 'Company name is too long'),

    startDate: z
        .string()
        .refine(val => !isNaN(Date.parse(val)), { message: 'Start date not valid' }),

    endDate: z
        .string()
        .optional()
        .nullable(),

    location: z
        .string().trim()
        .min(2, 'Location is too short')
        .max(160, 'Location is too long'),

    description: z.string().trim()
        .max(1000, 'Description is too long')
        .optional().nullable(),

    isWorking: z
        .boolean()
        .optional(),

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

    if (!data.isWorking) {
        if (!data.endDate) {
            ctx.addIssue({
                path: ['endDate'],
                message: 'End date is required if not still working',
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

export type ExperienceFormData = z.infer<typeof experienceSchema>;
