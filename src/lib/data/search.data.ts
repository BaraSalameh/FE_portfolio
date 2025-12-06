import { dynamicApi } from "@/lib/utils"
import { MAX_PAGE_SIZE } from "../utilities";

export { fetchFilteredUsers };

const fetchFilteredUsers = async (query: string, currentPage: number) => {

    const response = await dynamicApi({
        method: "GET",
        url: `Client/UserList?Search=${query}&PageNumber=${currentPage - 1}&PageSize=${MAX_PAGE_SIZE}`
    })

    return response.data;
}