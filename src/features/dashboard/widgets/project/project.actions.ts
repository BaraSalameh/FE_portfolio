'use server';

import { z } from 'zod';
import { getApiErrorPayload } from '@/lib/api/errors';
import { requireAuthenticatedRequest } from '@/lib/api/server-client';
import { ActionResult } from '@/lib/definitions/actions.definitions';
import { projectSchema, ProjectFormData } from './schema';
import { getProjects, removeProject, reorderProjects, saveProject } from './project.service';
import { ProjectResponse } from './types.project';

const idSchema = z.string().trim().min(1, 'Project ID is required');
const sortSchema = z.array(idSchema).min(1, 'At least one project is required');

const runProjectMutation = async (
    mutation: () => Promise<void>,
): Promise<ActionResult<ProjectResponse[]>> => {
    try {
        await requireAuthenticatedRequest();
        await mutation();
        return { success: true, data: await getProjects() };
    } catch (error) {
        return { success: false, error: getApiErrorPayload(error) };
    }
};

export const saveProjectAction = async (
    input: ProjectFormData,
): Promise<ActionResult<ProjectResponse[]>> => {
    const parsed = projectSchema.safeParse(input);
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues.map(issue => issue.message).join(' ') };
    }

    return runProjectMutation(() => saveProject(parsed.data));
};

export const deleteProjectAction = async (
    input: string,
): Promise<ActionResult<ProjectResponse[]>> => {
    const parsed = idSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

    return runProjectMutation(() => removeProject(parsed.data));
};

export const sortProjectsAction = async (
    input: string[],
): Promise<ActionResult<ProjectResponse[]>> => {
    const parsed = sortSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

    return runProjectMutation(() => reorderProjects(parsed.data));
};
