import { guidRegex } from '@/lib/utils';
import { z } from 'zod';

export const userSkillSchema = z.object({
    lstUserSkills: z.array(
        z.object({
            LKP_SkillID: z
                .string()
                .min(1, 'Skill is required')
                .regex(guidRegex, 'Skill ID must be a valid GUID'),
            EducationID: z.preprocess(
                val => val === '' ? null : val,
                z.string()
                .regex(guidRegex, 'Education ID must be a valid GUID')
                .optional()
                .nullable()
            ),
            ExperienceID: z.preprocess(
                val => val === '' ? null : val,
                z.string()
                .regex(guidRegex, 'Experience ID must be a valid GUID')
                .optional()
                .nullable()
            ),
            ProjectID: z.preprocess(
                val => val === '' ? null : val,
                z.string()
                .regex(guidRegex, 'Project ID must be a valid GUID')
                .optional()
                .nullable()
            ),
            CertificateID: z.preprocess(
                val => val === '' ? null : val,
                z.string()
                .regex(guidRegex, 'Certificate ID must be a valid GUID')
                .optional()
                .nullable()
            )
        })
    ),
});

export const skillSchema = z.object({
    id: z.string(),
    name: z
        .string()
        .min(3, 'Name is too short'),
    iconUrl: z
        .string()
        .max(1000, 'Image string is too long'),
});

export const skillCategorySchema = z.object({
    id: z.string(),
    name: z
        .string()
        .min(3, 'Name is too short'),
});

export type UserSkillFormData = z.infer<typeof userSkillSchema>;
export type SkillFormData = z.infer<typeof skillSchema>;
export type SkillCategoryFormData = z.infer<typeof skillCategorySchema>;