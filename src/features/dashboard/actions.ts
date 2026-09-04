'use server';

import { z } from 'zod';
import { certificateSchema } from '@/features/dashboard/widgets/certificate/schema';
import { educationSchema } from '@/features/dashboard/widgets/education/schema';
import { experienceSchema } from '@/features/dashboard/widgets/experience/schema';
import { userLanguageSchema } from '@/features/dashboard/widgets/language/schema';
import { userSkillSchema } from '@/features/dashboard/widgets/skill/schema';
import { profileSchema } from '@/features/dashboard/profile/schema';
import { contactMessageSchema } from '@/features/dashboard/profile/contact-message/schema';
import { userWidgetPreferenceSchema } from '@/features/dashboard/profile/settings/widget-preferences/schema';
import { userChartPreferenceSchema } from '@/features/dashboard/profile/settings/chart-preferences/schema';
import { getApiErrorPayload } from '@/lib/api/errors';
import { requireAuthenticatedRequest, serverApi } from '@/lib/api/server-client';
import { ActionResult } from '@/lib/definitions/actions.definitions';

const idPayloadSchema = z.object({ id: z.string().trim().min(1) });
const schemas: Record<string, z.ZodType> = {
    '/Owner/AddEditEducation': educationSchema,
    '/Owner/AddEditExperience': experienceSchema,
    '/Owner/AddEditCertificate': certificateSchema,
    '/Owner/EditDeleteUserSkill': userSkillSchema,
    '/Owner/EditDeleteUserLanguage': userLanguageSchema,
    '/Owner/EditProfile': profileSchema,
    '/Owner/EditUserPreference': userWidgetPreferenceSchema,
    '/Owner/EditUserChartPreference': userChartPreferenceSchema,
    '/Owner/DeleteEducation': idPayloadSchema,
    '/Owner/DeleteExperience': idPayloadSchema,
    '/Owner/DeleteCertificate': idPayloadSchema,
    '/Owner/SignMessage': idPayloadSchema,
    '/Owner/DeleteMessage': idPayloadSchema,
    '/Owner/ReOrderEducation': z.object({ educationIdsInOrder: z.array(z.string().min(1)).min(1) }),
    '/Owner/SortExperience': z.object({ experienceIdsInOrder: z.array(z.string().min(1)).min(1) }),
    '/Owner/SortCertificate': z.object({ CertificateIdsInOrder: z.array(z.string().min(1)).min(1) }),
    '/Client/SendEmail': contactMessageSchema,
};

interface MutationRequest {
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    url: string;
    data: unknown;
}

export const executeDashboardMutation = async (
    request: MutationRequest,
): Promise<ActionResult> => {
    const schema = schemas[request.url];
    if (!schema) return { success: false, error: 'Unsupported mutation' };

    const parsed = schema.safeParse(request.data);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues.map(issue => issue.message).join(' ') };
    }

    try {
        if (request.url !== '/Client/SendEmail') await requireAuthenticatedRequest();
        await serverApi({
            ...request,
            data: parsed.data,
            sendCredentials: request.url !== '/Client/SendEmail',
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: getApiErrorPayload(error) };
    }
};
