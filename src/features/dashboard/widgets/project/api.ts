import 'server-only';

import { serverApi } from '@/lib/api/server-client';
import { PaginatedResponse } from '@/lib/api/types';
import { transformPayload } from '@/lib/utils/transform';
import { ProjectFormData } from './schema';
import { ProjectResponse } from './types.project';

export const getProjects = async () => {
    const response = await serverApi<PaginatedResponse<ProjectResponse>>({
        method: 'GET',
        url: '/Owner/ProjectList',
    });

    return response.status === 204 ? [] : response.data.items;
};

export const saveProject = async (project: ProjectFormData) => {
    await serverApi({
        method: 'POST',
        url: '/Owner/AddEditProject',
        data: transformPayload(project),
    });
};

export const removeProject = async (id: string) => {
    await serverApi({
        method: 'DELETE',
        url: '/Owner/DeleteProject',
        data: { id },
    });
};

export const reorderProjects = async (projectIds: string[]) => {
    await serverApi({
        method: 'POST',
        url: '/Owner/SortProject',
        data: { ProjectIdsInOrder: projectIds },
    });
};
