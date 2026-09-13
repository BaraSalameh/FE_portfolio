import { guidRegex, urlRegex } from '@/lib/utils';
import { z } from 'zod';

const optionalUrl = z
    .string()
    .regex(urlRegex, 'Invalid URL')
    .nullable()
    .or(z.literal('').transform(() => null))

export const certificateSchema = z.object({
    id: z.string().optional(),
    LKP_CertificateID: z.preprocess(
        val => val === '' ? null : val,
        z.string()
        .regex(guidRegex, 'Certificate ID must be a valid GUID')
    ),
    issueDate: z.preprocess(
        val => val === '' ? null : val,
        z.string()
        .nullish()
    ),
    expirationDate: z.preprocess(
        val => val === '' ? null : val,
        z.string()
        .nullish()
    ),
    credintialID: z.preprocess(
        val => val === '' ? null : val,
        z.string().trim().max(200, 'Credential ID is too long')
        .nullish()
    ),
    credintialUrl: optionalUrl.optional(),
    lstSkills: z.array(z.string()).nullish(),
    lstCertificateMedias: z
        .union([z.array(z.string()), z.string()])
        .transform((val) => (Array.isArray(val) ? val : [val]))
        .nullish(),
}).superRefine((data, ctx) => {
    if (data.issueDate && Number.isNaN(Date.parse(data.issueDate))) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['issueDate'], message: 'Issue date is not valid' });
    }
    if (data.expirationDate && Number.isNaN(Date.parse(data.expirationDate))) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['expirationDate'], message: 'Expiration date is not valid' });
    }
    if (data.issueDate && data.expirationDate && new Date(data.expirationDate) < new Date(data.issueDate)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['expirationDate'], message: 'Expiration date must be after the issue date' });
    }
});

export const lkp_certificateSchema = z.object({
    id: z.string(),
    name: z
        .string().trim()
        .min(2, 'Name is too short')
        .max(160, 'Name is too long'),
});

export type CertificateFormData = z.infer<typeof certificateSchema>;
export type LKP_CertificateSchemaFormData = z.infer<typeof lkp_certificateSchema>;
