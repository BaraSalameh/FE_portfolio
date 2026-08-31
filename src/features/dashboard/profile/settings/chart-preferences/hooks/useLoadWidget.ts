'use client';

import { useEffect } from "react";
import { widgetListQuery } from "../thunks";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

export const useLoadWidget = () => {
    const dispatch = useAppDispatch();
    const { lstWidgets } = useAppSelector((state) => state.userChartPreference.widget);
        
    useEffect(() => {
        if (lstWidgets.length === 0) dispatch(widgetListQuery());
    }, [dispatch, lstWidgets.length]);
}
