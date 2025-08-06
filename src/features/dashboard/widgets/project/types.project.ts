import { ProjectFormData } from "./schema";


// form
export interface ProjectProps {
    id?: string;
    onClose?: () => void;
}

// slice
export interface ProjectState {
    lstProjects: ProjectFormData[],
    loading: boolean;
    error: string | null;
}