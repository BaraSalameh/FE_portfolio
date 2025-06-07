export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none' | 'full';

export type FetchAction = {
    query?: string;
    page: number;
    pageSize?: number;
}