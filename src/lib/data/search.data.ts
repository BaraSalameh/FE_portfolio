import { MAX_PAGE_SIZE } from "../utilities";
import { SearchResponse } from "../definitions/search.definitions";
import { dynamicFetch } from "../api/fetchClient";

export { fetchFilteredUsers };

const fetchFilteredUsers = async (query: string, currentPage: number): Promise<SearchResponse> => {

    const response = await dynamicFetch({
        method: "GET",
        url: `/Client/UserList?Search=${query}&PageNumber=${currentPage - 1}&PageSize=${MAX_PAGE_SIZE}`
    })

    return response.status === 204
    ?   { items: [], rowCount: 0}
    :   response.json();
}