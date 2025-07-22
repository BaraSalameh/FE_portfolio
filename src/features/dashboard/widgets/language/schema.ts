import { guidRegex } from '@/lib/utils';
import { z } from 'zod';

export const userLanguageSchema = z.object({
    lstLanguages: z.array(
        z.object({
            lkP_LanguageID: z
                .string()
                .min(1, 'Language is required')
                .regex(guidRegex, 'Language ID must be a valid GUID'),
            lkP_LanguageProficiencyID: z
                .string()
                .min(1, 'Proficiency is required')
                .regex(guidRegex, 'Proficiency ID must be a valid GUID'),
        })
    ),
});

export const languageSchema = z.object({
    id: z.string(),
    name: z
        .string()
        .min(3, 'Name is too short'),
});

export const languageProficiencySchema = z.object({
    id: z.string(),
    level: z
        .string()
        .min(3, 'Name is too short'),
});

export type UserLanguageFormData = z.infer<typeof userLanguageSchema>;
export type LanguageFormData = z.infer<typeof languageSchema>;
export type LanguageProficiencyFormData = z.infer<typeof languageProficiencySchema>;