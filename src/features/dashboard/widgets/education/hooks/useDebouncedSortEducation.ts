import { useAppDispatch } from "@/lib/store/hooks";
import debounce from "lodash.debounce";
import { useEffect, useMemo } from "react";
import { educationListQuery, sortEducation } from "../apis";

export const useDebouncedSortEducation = () => {
  const dispatch = useAppDispatch();

  const sort = useMemo(
        () => debounce(async (lstIds: string[]) => {
            if (lstIds.length > 0) {
                await dispatch(sortEducation(lstIds));
                await dispatch(educationListQuery());
            }
        }, 1000),
        [dispatch]
    );

  useEffect(() => () => sort.cancel(), [sort]);
  return sort;
};
