'use client';

import { useEffect } from "react";
import { chartTypeListQuery } from "../apis";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

export const useLoadChartType = () => {
    const dispatch = useAppDispatch();
    const { lstChartTypes } = useAppSelector((state) => state.userChartPreference.chartType);
        
    useEffect(() => {
        if (lstChartTypes.length === 0) dispatch(chartTypeListQuery());
    }, [dispatch, lstChartTypes.length]);
}
