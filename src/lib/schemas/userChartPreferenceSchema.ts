import { z } from 'zod';

const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
const optionalString = z
    .string()
    .nullable()
    .or(z.literal('').transform(() => null))

export const userChartPreferenceSchema = z.object({
    LKP_WidgetID: z
        .string()
        .min(1, 'Widget ID is required')
        .regex(guidRegex, 'Preference ID must be a valid GUID'),
    LKP_ChartType: z
        .string()
        .min(1, 'ChartType ID is required')
        .regex(guidRegex, 'Preference ID must be a valid GUID'),
    groupBy: z
        .string()
        .min(1, 'groupBy value is required'),
    valueSource: optionalString.optional()
});

export const widgetSchema = z.object({
    id: z
        .string()
        .min(1, 'Widget ID is required')
        .regex(guidRegex, 'Preference ID must be a valid GUID'),
    name: z
        .string()
        .min(1, 'Widget name is required'),
});

export const chartTypeSchema = z.object({
    id: z
        .string()
        .min(1, 'ChartType ID is required')
        .regex(guidRegex, 'Preference ID must be a valid GUID'),
    name: z
        .string()
        .min(1, 'ChartType name is required'),
});

export type UserChartPreferenceFormData = z.infer<typeof userChartPreferenceSchema>;
export type WidgetFormData = z.infer<typeof widgetSchema>;
export type ChartTypeFormData = z.infer<typeof chartTypeSchema>;