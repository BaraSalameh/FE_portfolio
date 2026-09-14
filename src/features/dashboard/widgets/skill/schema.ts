import { guidRegex } from '@/lib/utils';
import { z } from 'zod';

const optionalIdList = z.preprocess(
    value => value === '' ? [] : value,
    z.array(z.string()).nullish(),
);

export const userSkillSchema = z.object({
    lstUserSkills: z.array(
        z.object({
            LKP_SkillID: z
                .string()
                .min(1, 'Skill is required')
                .regex(guidRegex, 'Skill ID must be a valid GUID'),

            EducationIDs: optionalIdList,

            ExperienceIDs: optionalIdList,

            ProjectIDs: optionalIdList,
            
            CertificateIDs: optionalIdList,
        })
    ),
}).superRefine((data, ctx) => {
    const seen = new Set<string>();
    data.lstUserSkills.forEach((item, index) => {
        if (seen.has(item.LKP_SkillID)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['lstUserSkills', index, 'LKP_SkillID'], message: 'Each skill can only be added once' });
        }
        seen.add(item.LKP_SkillID);
    });
});

export const skillSchema = z.object({
    id: z.string(),
    name: z
        .string().trim()
        .min(2, 'Name is too short')
        .max(120, 'Name is too long'),
    iconUrl: z
        .string()
        .max(1000, 'Image string is too long'),
    source: z.string().optional().nullable(),
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
