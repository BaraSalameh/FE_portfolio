import { useAppDispatch } from "@/lib/store/hooks";
import debounce from "lodash.debounce";
import { useCallback } from "react";
import { educationListQuery, sortEducation } from "../apis";

export const useDebouncedSortEducation = () => {
  const dispatch = useAppDispatch();

  return useCallback(
        debounce(async (lstIds: string[]) => {
            if (lstIds.length > 0) {
                await dispatch(sortEducation(lstIds));
                await dispatch(educationListQuery());
            }
        }, 1000),
        [dispatch]
    );
};