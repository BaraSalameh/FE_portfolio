import { ProfileFormData } from './profile/schema';
import { UserChartPreferenceResponse } from './profile/settings/chart-preferences/types.chart-preferences';
import { UserWidgetPreferenceResponse } from './profile/settings/widget-preferences/types.widget-preferences';
import { CertificateResponse } from './widgets/certificate/types.certificate';
import { EducationResponse } from './widgets/education/types.education';
import { ExperienceResponse } from './widgets/experience/types.experience';
import { UserLanguageResponse } from './widgets/language/types.language';
import { ProjectResponse } from './widgets/project/types.project';
import { UserSkillResponse } from './widgets/skill/types.skill';

export interface DashboardResponse {
    user: ProfileFormData;
    lstUserPreferences: UserWidgetPreferenceResponse[];
    lstUserChartPreferences: UserChartPreferenceResponse[];
    lstCertificates: CertificateResponse[];
    lstEducations: EducationResponse[];
    lstExperiences: ExperienceResponse[];
    lstUserLanguages: UserLanguageResponse[];
    lstProjects: ProjectResponse[];
    lstUserSkills: UserSkillResponse[];
    unreadContactMessageCount: number;
}
