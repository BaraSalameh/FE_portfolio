import { useAppDispatch } from "@/lib/store/hooks";
import debounce from "lodash.debounce";
import { useCallback } from "react";
import { experienceListQuery, sortExperience } from "../apis";

export const useDebouncedSortExperience = () => {
  const dispatch = useAppDispatch();

  return useCallback(
        debounce(async (lstIds: string[]) => {
            if (lstIds.length > 0) {
                await dispatch(sortExperience(lstIds));
                await dispatch(experienceListQuery());
            }
        }, 1000),
        [dispatch]
    );
};