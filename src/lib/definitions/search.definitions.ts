export interface TableParams {
    query: string;
    page: number;
}

interface UserInfo {
    firstname: string;
    lastname: string;
    username: string;
    title?: string;
    profilePicture?: string;
}

export interface SearchResponse {
    items: UserInfo[];
    rowCount: number;
}
