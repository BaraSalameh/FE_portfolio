import { useAppDispatch } from "@/lib/store/hooks";
import debounce from "lodash.debounce";
import { useEffect, useMemo } from "react";
import { sortProjectsAction } from '../project.actions';
import { projectMutationFailed, projectMutationStarted, projectMutationSucceeded } from '../slice';

export const useDebouncedSortProject = () => {
  const dispatch = useAppDispatch();

  const sort = useMemo(
        () => debounce(async (lstIds: string[]) => {
            if (lstIds.length > 0) {
                dispatch(projectMutationStarted());
                const result = await sortProjectsAction(lstIds);
                if (!result.success) {
                    dispatch(projectMutationFailed(result.error));
                    return;
                }
                dispatch(projectMutationSucceeded(result.data));
            }
        }, 1000),
        [dispatch]
    );

  useEffect(() => () => sort.cancel(), [sort]);
  return sort;
};
