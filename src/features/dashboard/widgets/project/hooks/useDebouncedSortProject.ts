import { useAppDispatch } from "@/lib/store/hooks";
import debounce from "lodash.debounce";
import { useCallback } from "react";
import { projectTechnologyListQuery, sortProject } from "../apis";

export const useDebouncedSortProject = () => {
  const dispatch = useAppDispatch();

  return useCallback(
        debounce(async (lstIds: string[]) => {
            if (lstIds.length > 0) {
                await dispatch(sortProject(lstIds));
                await dispatch(projectTechnologyListQuery());
            }
        }, 1000),
        [dispatch]
    );
};