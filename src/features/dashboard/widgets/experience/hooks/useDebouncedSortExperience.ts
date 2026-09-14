import { useAppDispatch } from "@/lib/store/hooks";
import debounce from "lodash.debounce";
import { useEffect, useMemo } from "react";
import { sortExperience } from "../thunks";

export const useDebouncedSortExperience = () => {
  const dispatch = useAppDispatch();

  const sort = useMemo(
        () => debounce(async (lstIds: string[]) => {
            if (lstIds.length > 0) {
                await dispatch(sortExperience(lstIds));
            }
        }, 1000),
        [dispatch]
    );

  useEffect(() => () => sort.cancel(), [sort]);
  return sort;
};
