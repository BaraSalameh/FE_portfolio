'use client';

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { useEffect } from "react"
import { widgetPreferenceListQuery } from "../thunks";

export const useLoadWidgetPreference = () => {
    const dispatch = useAppDispatch();
    const { lstPreferences } = useAppSelector((state) => state.userWidgetPreference.preference);

    useEffect(() => {
        if (lstPreferences.length === 0) dispatch(widgetPreferenceListQuery());
    }, [dispatch, lstPreferences.length]);
}
