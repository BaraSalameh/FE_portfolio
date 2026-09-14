import { createAction } from '@reduxjs/toolkit';
import type { CertificateResponse } from './widgets/certificate/types.certificate';
import type { EducationResponse } from './widgets/education/types.education';
import type { ExperienceResponse } from './widgets/experience/types.experience';
import type { ProjectResponse } from './widgets/project/types.project';

export type ParentRecordSaved =
    | { kind: 'education'; record: EducationResponse }
    | { kind: 'experience'; record: ExperienceResponse }
    | { kind: 'project'; record: ProjectResponse }
    | { kind: 'certificate'; record: CertificateResponse };

export const parentRecordSaved = createAction<ParentRecordSaved>('dashboard/parentRecordSaved');

export type ParentRecordDeleted = {
    kind: ParentRecordSaved['kind'];
    id: string;
};

export const parentRecordDeleted = createAction<ParentRecordDeleted>('dashboard/parentRecordDeleted');
