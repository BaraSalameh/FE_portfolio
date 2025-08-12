import { useEffect } from "react";
import { widgetListQuery } from "../apis";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";

export const useLoadWidget = () => {
    const dispatch = useAppDispatch();
    const { lstWidgets } = useAppSelector((state) => state.userChartPreference.widget);
        
    useEffect(() => {
        lstWidgets.length === 0 && dispatch(widgetListQuery());
    }, []);
}