import { useAppDispatch } from "@/lib/store/hooks";
import debounce from "lodash.debounce";
import { useCallback } from "react";
import { certificateListQuery, sortCertificate } from "../apis";

export const useDebouncedSortCertificate = () => {
  const dispatch = useAppDispatch();

  return useCallback(
        debounce(async (lstIds: string[]) => {
            if (lstIds.length > 0) {
                await dispatch(sortCertificate(lstIds));
                await dispatch(certificateListQuery());
            }
        }, 1000),
        [dispatch]
    );
};