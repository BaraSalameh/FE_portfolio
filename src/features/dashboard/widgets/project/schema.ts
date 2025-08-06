import { urlRegex } from '@/lib/utils';
import { z } from 'zod';

const optionalUrl = z
    .string()
    .regex(urlRegex, 'Invalid URL')
    .nullable()
    .or(z.literal('').transform(() => null))

export const projectSchema = z.object({
    id: z.string().optional(),

    title: z
        .string()
        .min(3, 'Title is too short'),

    liveLink: optionalUrl.optional(),
        
    sourceCode: optionalUrl.optional(),

    imageUrl: optionalUrl.optional(),

    description: z.preprocess(
        val => val === '' ? null : val,
        z.string().max(1000, 'Describtion is too long')
        .nullable()
    ),

    isFeatured: z
        .boolean()
        .optional(),

    EducationID: z
        .string()
        .optional()
        .nullable(),
    
    ExperienceID: z
        .string()
        .optional()
        .nullable(),
    
    lstSkills: z.array(z.string()).nullish(),
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

export type ProjectFormData = z.infer<typeof projectSchema>;
export type SkillFormData = z.infer<typeof skillSchema>;