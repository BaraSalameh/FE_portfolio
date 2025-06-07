import { contactMessageListQuery, deleteEducation, deleteExperience, deleteMessage, deleteProject, educationListQuery, experienceListQuery, projectTechnologyListQuery, signMessage, sortEducation, sortExperience, sortProject, userByUsernameQuery, userFullInfoQuery, userLanguageListQuery } from "@/lib/apis";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { markMessage, removeMessage } from "@/lib/store/slices/contactMessageSlice";
import debounce from "lodash.debounce";
import { useCallback, useEffect } from "react";

export const useLoadUserData = (role: 'owner' | 'client' | 'admin', username: string, user: any) => {
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        if(!user) {
            switch (role) {
                case 'owner':
                    dispatch(userFullInfoQuery());
                    break;
                case 'client':
                    dispatch(userByUsernameQuery(username));
                    break;
            }
        }
    }, [user, dispatch]);
};

export const useHandleEducationDelete = () => {
  const dispatch = useAppDispatch();

  return async (id: string) => {
        try {
            await dispatch(deleteEducation(id));
            await dispatch(educationListQuery());
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    }
};

export const useHandleProjectDelete = () => {
  const dispatch = useAppDispatch();

  return async (id: string) => {
        try {
            await dispatch(deleteProject(id));
            await dispatch(projectTechnologyListQuery());
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    }
};

export const useHandleExperienceDelete = () => {
  const dispatch = useAppDispatch();

  return async (id: string) => {
        try {
            await dispatch(deleteExperience(id));
            await dispatch(experienceListQuery());
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    }
};

export const useHandleMessageDelete = () => {
  const dispatch = useAppDispatch();

  return async (id: string) => {
        try {
            await dispatch(deleteMessage(id));
            dispatch(removeMessage(id));
        } catch (err) {
            console.error('Failed to delete:', err);
        }
    }
};

export const useHandleSignMessage = () => {
    const dispatch = useAppDispatch();
    const { lstMessages } = useAppSelector(state => state.contactMessage);

    return async (id: string) => {
        const currentMessage = lstMessages.find(msg => msg?.id === id);
        if(!currentMessage?.isRead)
            try {
                await dispatch(signMessage(id));
                dispatch(markMessage(id));
            } catch (err) {
                console.error('Failed to delete:', err);
            }
        }
};

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

export const useLoadContactMessageData = (messages: any) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        !(Array.isArray(messages) && messages.length > 0) && dispatch(contactMessageListQuery({page: 0}));
    }, []);
};