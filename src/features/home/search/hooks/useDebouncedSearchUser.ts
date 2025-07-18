import { useAppDispatch } from "@/lib/store/hooks";
import debounce from "lodash.debounce";
import { useCallback } from "react";
import { userListQuery } from "../apis";

export const useDebouncedSearchUser = () => {
    const dispatch = useAppDispatch();

    return useCallback(
        debounce(async (value: string) => {
            value.trim().length > 0 
                &&  dispatch(userListQuery({ query: value, page: 0 }));
        }, 500),
        [dispatch]
    );
};