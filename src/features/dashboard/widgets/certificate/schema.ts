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
        z.string()
        .nullish()
    ),
    credintialUrl: optionalUrl.optional(),
    lstSkills: z.array(z.string()).nullish(),
    lstCertificateMedias: z
        .union([z.array(z.string()), z.string()])
        .transform((val) => (Array.isArray(val) ? val : [val]))
        .nullish(),
});

export const lkp_certificateSchema = z.object({
    id: z.string(),
    name: z
        .string()
        .min(3, 'Name is too short'),
});

export type CertificateFormData = z.infer<typeof certificateSchema>;
export type LKP_CertificateSchemaFormData = z.infer<typeof lkp_certificateSchema>;