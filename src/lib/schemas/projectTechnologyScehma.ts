import { z } from 'zod';

const URLRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

const optionalUrl = z
    .string()
    .regex(URLRegex, 'Invalid URL')
    .nullable()
    .or(z.literal('').transform(() => null))

export const projectTechnologySchema = z.object({
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
    
    lstTechnologies: z
        .array(z.string())
});

export const technologySchema = z.object({
    id: z.string(),
    name: z
        .string()
        .min(3, 'Name is too short'),
    iconUrl: z
        .string()
        .max(1000, 'Image string is too long'),
});

export type ProjectTechnologyFormData = z.infer<typeof projectTechnologySchema>;
export type TechnologyFormData = z.infer<typeof technologySchema>;