import { guidRegex } from '@/lib/utils';
import { z } from 'zod';

export const skillSchema = z.object({
    lstSkills: z.array(
        z.object({
            lkP_SkillID: z
                .string()
                .min(1, 'Skill is required')
                .regex(guidRegex, 'Skill ID must be a valid GUID'),
            EducationID: z
                .string()
                .optional()
                .nullable(),
            experienceID: z
                .string()
                .optional()
                .nullable(),
            projectID: z
                .string()
                .optional()
                .nullable(),
            proficiency: z
                .number()
                .min(0, { message: "Must be at least 0" })
                .max(100, { message: "Must be at most 100" }),
            description: z.preprocess(
                val => val === '' ? null : val,
                z.string().max(1000, 'Describtion is too long')
                .nullable()
            ),
        })
    ),
});

export const lkpSkillSchema = z.object({
    id: z.string(),
    name: z
        .string()
        .min(3, 'Name is too short'),
    iconUrl: z
        .string()
        .max(1000, 'Image string is too long'),
});

export const lkpSkillCategorySchema = z.object({
    id: z.string(),
    name: z
        .string()
        .min(3, 'Name is too short'),
});

export type SkillFormData = z.infer<typeof skillSchema>;
export type LkpSkillFormData = z.infer<typeof lkpSkillSchema>;
export type LkpSkillCategoryFormData = z.infer<typeof lkpSkillCategorySchema>;