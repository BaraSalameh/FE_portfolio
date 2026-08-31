import { MAX_PAGE_SIZE } from "../utilities";
import { SearchResponse } from "../definitions/search.definitions";
import { serverApiResponse } from '../api/server-client';

export { fetchFilteredUsers };

const fetchFilteredUsers = async (query: string, currentPage: number): Promise<SearchResponse> => {

    const response = await serverApiResponse({
        method: "GET",
        url: `/Client/UserList?Search=${query}&PageNumber=${currentPage - 1}&PageSize=${MAX_PAGE_SIZE}`
    })

    return response.status === 204
    ?   { items: [], rowCount: 0}
    :   response.json();
}
