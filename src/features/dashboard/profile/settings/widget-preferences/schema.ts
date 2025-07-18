import { z } from 'zod';

const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;

export const userWidgetPreferenceSchema = z.object({
    LKP_PreferenceID: z
        .string()
        .min(1, 'Preference ID is required')
        .regex(guidRegex, 'Preference ID must be a valid GUID'),
    value: z
        .string()
        .min(1, 'Preference value is required'),
});

export const widgetPreferenceSchema = z.object({
    id: z
        .string()
        .min(1, 'Preference ID is required')
        .regex(guidRegex, 'Preference ID must be a valid GUID'),
    name: z
        .string()
        .min(1, 'Preference name is required'),
});

export type UserWidgetPreferenceFormData = z.infer<typeof userWidgetPreferenceSchema>;
export type WidgetPreferenceFormData = z.infer<typeof widgetPreferenceSchema>;