import { useAppDispatch } from "@/lib/store/hooks";
import debounce from "lodash.debounce";
import { useCallback } from "react";
import { projectListQuery, sortProject } from "../apis";

export const useDebouncedSortProject = () => {
  const dispatch = useAppDispatch();

  return useCallback(
        debounce(async (lstIds: string[]) => {
            if (lstIds.length > 0) {
                await dispatch(sortProject(lstIds));
                await dispatch(projectListQuery());
            }
        }, 1000),
        [dispatch]
    );
};