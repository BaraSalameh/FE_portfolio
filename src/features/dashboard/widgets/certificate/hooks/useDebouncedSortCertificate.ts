import { useAppDispatch } from "@/lib/store/hooks";
import debounce from "lodash.debounce";
import { useEffect, useMemo } from "react";
import { certificateListQuery, sortCertificate } from "../apis";

export const useDebouncedSortCertificate = () => {
  const dispatch = useAppDispatch();

  const sort = useMemo(
        () => debounce(async (lstIds: string[]) => {
            if (lstIds.length > 0) {
                await dispatch(sortCertificate(lstIds));
                await dispatch(certificateListQuery());
            }
        }, 1000),
        [dispatch]
    );

  useEffect(() => () => sort.cancel(), [sort]);
  return sort;
};
