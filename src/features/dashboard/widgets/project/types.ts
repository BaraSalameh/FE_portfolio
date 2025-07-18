import { ProjectTechnologyFormData, TechnologyFormData } from "./schema";

// form
export interface ProjectTechnologyProps {
    id?: string;
    onClose?: () => void;
}

// slice
export interface ProjectTechnologyState {
    lstProjectTechnologies: ProjectTechnologyFormData[],
    technology: TechnologyState;
    loading: boolean;
    error: string | null;
}

interface TechnologyState {
    lstTechnologies: TechnologyFormData[];
    technologiesRowCount: number;
    loading: boolean;
    error: string | null;
}