import { useAppDispatch } from "@/lib/store/hooks";
import debounce from "lodash.debounce";
import { useEffect, useMemo } from "react";
import { projectListQuery, sortProject } from "../apis";

export const useDebouncedSortProject = () => {
  const dispatch = useAppDispatch();

  const sort = useMemo(
        () => debounce(async (lstIds: string[]) => {
            if (lstIds.length > 0) {
                await dispatch(sortProject(lstIds));
                await dispatch(projectListQuery());
            }
        }, 1000),
        [dispatch]
    );

  useEffect(() => () => sort.cancel(), [sort]);
  return sort;
};
